'use strict'
const doctrine = require("doctrine");
const util = require('util')

module.exports = {
    create (context) {


        // rule implementation ...
        const source = context.getSourceCode();

        // console.log(source)
        /**
         * Report the error message
         * @param {ASTNode} node node to report
         * @returns {void}
         */
        function report(node) {
            context.report({node, message: "Missing JSDoc comment."});
        }

        function checkJSDoc(nodes) {
            nodes.forEach(jsdocNode => {
                // console.log(jsdocNode.value)
                const leadingComments = jsdocNode.leadingComments
                if (!leadingComments) {
                    context.report({node: jsdocNode, message: "Missing JSDoc."});
                    return
                }
                const l = leadingComments.length
                const comment = leadingComments[l - 1].value
                const params = Object.create(null)

                let jsdoc, hasReturn
                try {
                    jsdoc = doctrine.parse(comment, {
                        strict: true,
                        unwrap: true,
                        sloppy: true
                    });
                } catch (ex) {

                    if (/braces/i.test(ex.message)) {
                        context.report({node: jsdocNode, message: "JSDoc type missing brace."});
                    } else {
                        context.report({node: jsdocNode, message: "JSDoc syntax error."});
                    }

                    return
                }

                // check for functions missing description
                if (!jsdoc.description) {
                    context.report({
                        node: jsdocNode,
                        message: "Missing JSDoc description for function."
                    });
                }

                jsdoc.tags.forEach(tag => {
                    switch (tag.title.toLowerCase()) {
                        case 'param':
                            if (!tag.type) {
                                context.report({
                                    node: jsdocNode,
                                    message: "Missing JSDoc parameter type for '{{name}}'.",
                                    data: {name: tag.name}
                                });
                            }

                            if (!tag.description) {
                                context.report({
                                    node: jsdocNode,
                                    message: "Missing JSDoc parameter description for '{{name}}'.",
                                    data: {name: tag.name}
                                });
                            }

                            if (params[tag.name]) {
                                context.report({
                                    node: jsdocNode,
                                    message: "Duplicate JSDoc parameter '{{name}}'.",
                                    data: {name: tag.name}
                                });
                            } else if (tag.name.indexOf(".") === -1) {
                                params[tag.name] = 1;
                            }
                            break;
                        // case 'return':
                        // case 'returns': // 如果有@returns，检测@returns 是否正确
                        //   hasReturn = true
                        //   if(!tag.type){
                        //     context.report({ node: jsdocNode, message: "Missing JSDoc return type." });
                        //   }
                        //   if (!tag.description) {
                        //     context.report({ node: jsdocNode, message: "Missing JSDoc return description." });
                        //   }
                        //   break;
                    }
                })


                // check for functions missing @returns
                /*if(!hasReturn){
                 context.report({
                 node: jsdocNode,
                 message: "Missing JSDoc @{{returns}} for function."
                 })
                 }*/


                // check the parameters
                const jsdocParams = Object.keys(params);

                if (jsdocNode.value && jsdocNode.value.params) {
                    jsdocNode.value.params.forEach((param, i) => {
                        if (param.type === "AssignmentPattern") {
                            param = param.left;
                        }

                        const name = param.name;

                        // TODO(nzakas): Figure out logical things to do with destructured, default, rest params
                        if (param.type === "Identifier") {
                            if (jsdocParams[i] && (name !== jsdocParams[i])) {
                                context.report({
                                    node: jsdocNode,
                                    message: "Expected JSDoc for '{{name}}' but found '{{jsdocName}}'.",
                                    data: {
                                        name,
                                        jsdocName: jsdocParams[i]
                                    }
                                });
                            } else if (!params[name]) {
                                context.report({
                                    node: jsdocNode, message: "Missing JSDoc for parameter '{{name}}'.", data: {
                                        name
                                    }
                                });
                            }
                        }
                    });
                }
            })
        }

        const default_opt = ['created', 'data']
        // console.log(context.options[0]['obj-doc'])
        let opt = context.options[0] && context.options[0]['ignoreMethods'] || []

        opt = default_opt.concat(opt)

        const blacklist = new Set();

        opt.forEach(item => blacklist.add(item))

        /**
         * 获取需要检测的method节点
         * @param  node
         * @returns {*}
         */
        function getJSDocNode(node) {

            let methodNodes = []
            if (util.isArray(node.properties)) {
                node.properties.forEach(item => {
                    if (item.key && blacklist.has(item.key.name)) return;
                    if (item.method) methodNodes.push(item)
                })
            }

            return methodNodes
        }


        return {
            ReturnStatement: function (node) {
                // at a ReturnStatement node while going down
                // console.log(node)
            },
            // at a function expression node while going up:
            // "FunctionExpression:exit": checkLastSegment,
            // "ArrowFunctionExpression:exit": checkLastSegment,
            ObjectExpression: function (node) {
                let methodNodes = getJSDocNode(node)
                if (methodNodes) {
                    checkJSDoc(methodNodes)
                }
            },
            onCodePathStart: function (codePath, node) {
                // console.log(node)

                // at the start of analyzing a code path
            },
            onCodePathEnd: function (codePath, node) {
                // at the end of analyzing a code path
            }
        }
    }
}