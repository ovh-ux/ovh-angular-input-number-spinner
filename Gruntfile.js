module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    /**
     * NOTE for CSS/LESS:
     * - (src/CSS -> dist/CSS) : use [concat:css, autoprefixer, cssmin]
     * - (src/LESS -> dist/CSS) : use [less, autoprefixer, cssmin]
     * - (src/LESS -> dist/LESS) : use [copy:less]
     */

    grunt.initConfig({
        pkg        : grunt.file.readJSON("package.json"),
        bower      : grunt.file.readJSON("bower.json"),
        distdir    : "dist",
        srcdir     : "src",
        lessdir    : "less",
        builddir   : ".work/.tmp",
        name       : grunt.file.readJSON("package.json").name || "ovh-angular-input-number-spinner",   // module name
        moduleName : "ovh-angular-input-number-spinner",

        // Clean
        clean      : {
            dist : {
                src : [
                    "<%= builddir %>",
                    "<%= distdir %>"
                ]
            }
        },

        // Copy files
        copy : {
            // Copy concatened JS file from builddir to dist/
            dist : {
                files : {
                    "<%= distdir %>/<%= name %>.js" : "<%= builddir %>/<%= name %>.js"
                }
            }
        },

        // Concatenation
        concat     : {
            dist : {
                files : {
                    "<%= builddir %>/<%= name %>.js" : [
                        "<%= srcdir %>/<%= name %>.js",
                        "<%= srcdir %>/**/*.js",
                        "<%=builddir%>/templates.js",
                        "!<%= srcdir %>/**/*.spec.js",
                        "<%= builddir %>/<%= name %>.tmpl.js"
                    ]
                }
            }
        },

        // ngMin
        ngAnnotate: {
            dist: {
                files: {
                    "<%= builddir %>/<%= name %>.js" : ["<%= builddir %>/<%= name %>.js"]
                }
            }
        },

        // Obfuscate
        uglify   : {
            js : {
                options : {
                    banner : "/*! <%= name %> - <%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */\n"
                },
                files   : {
                    "<%= distdir %>/<%= name %>.min.js" : ["<%= builddir %>/<%= name %>.js"]
                }
            }
        },

        // Compiles Less to CSS
        less: {
            all: {
                files: {
                    "<%= builddir %>/<%= name %>.css" : "<%= lessdir %>/**/*.less"
                }
            }
        },

        // ... and its prefixed vendor styles
        autoprefixer: {
            options: {
                browsers: ["last 3 versions", "ie >= 9", "> 5%"]
            },
            dist: {
                files: {
                    "<%= distdir %>/<%= name %>.css" : ["<%= builddir %>/<%= name %>.css"]
                }
            }
        },

        cssmin : {
            options: {},
            dist : {
                files: {
                    "<%= distdir %>/<%= name %>.min.css" : ["<%= distdir %>/<%= name %>.css"]
                }
            }
        },

        // Package all the html partials into a single javascript payload
        ngtemplates: {
            options: {
                // This should be the name of your apps angular module
                module: "<%= moduleName %>",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                cwd: "<%=srcdir%>",
                src: ["**/*.html"],
                dest: "<%=builddir%>/templates.js"
            }
        },

        // JS Check
        jshint     : {
            options : {
                jshintrc : ".jshintrc",
                reporter: require("jshint-stylish")
            },
            js      : [
                "<%= srcdir %>/*.js",
                "<%= srcdir %>/*/*.js",
                "!<%= srcdir %>/**/*.spec.js"
            ]
        },

        // Check complexity
        complexity : {
            generic : {
                src     : [
                    "<%= srcdir %>/**/*.js",
                    "!<%= srcdir %>/**/*.spec.js"
                ],
                options : {
                    errorsOnly      : false,
                    cyclomatic      : 7,
                    halstead        : 30,
                    maintainability : 50
                }
            }
        },

        ngdocs: {
            options: {
                dest: "docs",
                html5Mode: false,
                title: "<%= name %>",
                startPage: "/api/ovh-angular-input-number-spinner",
                sourceLink: 'https://github.com/ovh-ux/<%= name %>/blob/master/{{file}}#L{{codeline}}'
            },
            api: {
                src: ["src/**/*.js"],
                title: "api"
            }
        },


        // Watch
        delta : {
            dist: {
                files : ["<%= srcdir %>/**/*", "!<%= srcdir %>/**/*.spec.js"],
                tasks: ["buildProd"]
            },
            test: {
                files : ["<%= srcdir %>/**/*.spec.js"],
                tasks: ["test"]
            }
        },

        // To release
        bump       : {
            options : {
                pushTo        : "origin",
                files         : [
                    "package.json",
                    "bower.json"
                ],
                updateConfigs : ["pkg", "bower"],
                commitFiles   : ["-a"]
            }
        },

        // Testing
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

        jscs: {
            src: [
                "<%= srcdir %>/*.js",
                "<%= srcdir %>/**/*.js"
            ],
            options: {
                config: ".jscsrc"
            }
        },

        watch: {
            js: {
                files: ["<%= srcdir %>/**/*.js"],
                tasks: ["buildProd"]
            },
            html: {
                files: ["<%= srcdir %>/**/*.html"],
                tasks: ["buildProd"]
            },
            less: {
                files: ["<%= srcdir %>/**/*.less"],
                tasks: ["less", "autoprefixer"]
            },
            livereload: {
                files: [
                    "<%= distdir %>/**/*"
                ],
                options: {
                    livereload: true
                }
            }
        },

        concurrent: {
            watch: {
                tasks: ["connect:docs", "watch", "open"],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        connect : {
            options : {
                port : 8000,
                hostname : "*"
            },
            docs : {
                options : {
                    keepalive : true
                }
            }
        },

        open: {
            server: {
                url: "http://localhost:8000/docs"
            }
        },

        wiredep: {
            test: {
                src: "./karma.conf.js",
                devDependencies: true
            }
        },

        eslint: {
            options: {
                configFile: "./.eslintrc.json"
            },
            target: ["src/**/!(*.spec|*.integration).js"]
        }
    });

    grunt.registerTask("buildProd", [
        "jshint",
        "eslint",
        "complexity",
        "ngtemplates",
        "concat:dist",
        "ngAnnotate",
        "uglify",
        "less",
        "autoprefixer",
        "cssmin",
        "copy:dist",
        "ngdocs"
    ]);

    grunt.registerTask("default", ["buildProd"]);

    grunt.registerTask("test", ["wiredep", "jshint", "eslint", "jscs", "karma"]);

    // Increase version number. Type = minor|major|patch
    grunt.registerTask("release", "Release", function () {
        var type = grunt.option("type");

        if (type && ~["patch", "minor", "major"].indexOf(type)) {
            grunt.task.run(["bump-only:" + type]);
        } else {
            grunt.verbose.or.write("You try to release in a weird version type [" + type + "]").error();
            grunt.fail.warn("Please try with --type=patch|minor|major");
        }
    });

};
