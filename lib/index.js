'use strict';

module.exports = function (babel) {
  'use strict';

  var _ = require('lodash'),
      generate = require("babel-generator").default,
      t = babel.types;

  var nodeToCode = function nodeToCode(node) {
    return generate(node, { minified: true }).code;
  };

  var visitJSXElement = {
    enter: function enter(path, state) {
      if (path.node.openingElement.selfClosing) {
        path.node.openingElement.selfClosing = false;
        path.node.closingElement = t.jSXClosingElement(path.node.openingElement.name);
      }
      var nameNode = path.node.openingElement.name;
      if (t.isJSXMemberExpression(nameNode)) {
        throw path.buildCodeFrameError("Member expressions are not supported.");
      }
    },
    exit: function exit(path, state) {
      var nameNode = path.node.openingElement.name;
      nameNode.name = _.kebabCase(nameNode.name);
    }
  };

  var visitor = {

    JSXElement: {
      enter: function enter(path, state) {
        visitJSXElement.enter(path, state);
        path.traverse(internalVisitor, {});
        path.replaceWith(t.stringLiteral(nodeToCode(path.node)));
      },
      exit: function exit(path, state) {
        visitJSXElement.exit(path, state);
      }
    },

    JSXNamespacedName: function JSXNamespacedName(path) {
      throw path.buildCodeFrameError("Namespace tags are not supported.");
    }
  };

  var internalVisitor = {

    JSXElement: {
      enter: function enter(path, state) {
        visitJSXElement.enter(path, state);
      },
      exit: function exit(path, state) {
        visitJSXElement.exit(path, state);
      }
    },

    JSXAttribute: function JSXAttribute(path, state) {
      var attrValueNode = path.node.value;
      var stringResult = void 0;
      if (!attrValueNode) {
        stringResult = 'true';
      } else {
        if (t.isJSXExpressionContainer(attrValueNode)) {
          var exprNodeToStringify = void 0;
          if (t.isArrowFunctionExpression(attrValueNode.expression) || t.isFunctionExpression(attrValueNode.expression)) {
            if (t.isBlockStatement(attrValueNode.expression.body)) {
              var lastStatement = _.last(attrValueNode.expression.body.body);
              if (t.isReturnStatement(lastStatement)) {
                exprNodeToStringify = lastStatement.argument;
              }
            } else {
              // expression
              exprNodeToStringify = attrValueNode.expression.body;
            }
          }
          if (!exprNodeToStringify) {
            exprNodeToStringify = attrValueNode.expression;
          }
          stringResult = nodeToCode(exprNodeToStringify);
        } else {
          // stringLiteral
          var tagName = path.parent.name.name;
          if (/^[a-z]|\-/.test(tagName)) {
            stringResult = attrValueNode.value;
          } else {
            stringResult = "'" + attrValueNode.value + "'";
          }
        }
        stringResult = stringResult.replace(/\n\s+/g, " ");
      }
      path.node.name.name = _.kebabCase(path.node.name.name);
      path.node.value = t.stringLiteral(stringResult);
    },
    JSXExpressionContainer: function JSXExpressionContainer(path, state) {
      path.replaceWith(t.jSXText('{{' + nodeToCode(path.node.expression) + '}}'));
    },
    JSXText: function JSXText(path, state) {
      // copy/paste from babel-type/lib/react#cleanJSXElementLiteralChild
      var lines = path.node.value.split(/\r\n|\n|\r/);

      var lastNonEmptyLine = 0;

      for (var i = 0; i < lines.length; i++) {
        if (lines[i].match(/[^ \t]/)) {
          lastNonEmptyLine = i;
        }
      }

      var str = "";

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        var isFirstLine = i === 0;
        var isLastLine = i === lines.length - 1;
        var isLastNonEmptyLine = i === lastNonEmptyLine;

        // replace rendered whitespace tabs with spaces
        var trimmedLine = line.replace(/\t/g, " ");

        // trim whitespace touching a newline
        if (!isFirstLine) {
          trimmedLine = trimmedLine.replace(/^[ ]+/, "");
        }

        // trim whitespace touching an endline
        if (!isLastLine) {
          trimmedLine = trimmedLine.replace(/[ ]+$/, "");
        }

        if (trimmedLine) {
          if (!isLastNonEmptyLine) {
            trimmedLine += " ";
          }

          str += trimmedLine;
        }
      }

      path.node.value = str;
    },
    JSXNamespacedName: function JSXNamespacedName(path) {
      throw path.buildCodeFrameError("Namespace tags are not supported.");
    },
    JSXSpreadAttribute: function JSXSpreadAttribute(path) {
      throw path.buildCodeFrameError("Spread attributes are not supported.");
    }
  };

  return {
    inherits: require("babel-plugin-syntax-jsx"),
    visitor: visitor
  };
};
