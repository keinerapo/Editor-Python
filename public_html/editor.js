$(document).ready(function () {
    var output = $('#edoutput');
    var outf = function (text) {
        output.text(output.text() + text);
    };
    
    var keymap = {
        "Ctrl-Enter" : function (editor) {
            Sk.configure({output: outf, read: builtinRead});
            Sk.canvas = "mycanvas";
            if (editor.getValue().indexOf('turtle') > -1 ) {
                $('#mycanvas').show();
            }
            Sk.pre = "edoutput";
            (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
            try {
                Sk.misceval.asyncToPromise(function() {
                    return Sk.importMainWithBody("<stdin>",false,editor.getValue(),true);
                });
            } catch(e) {
                outf(e.toString() + "\n");
            }
        },
        "Shift-Enter": function (editor) {
            Sk.configure({output: outf, read: builtinRead});
            Sk.canvas = "mycanvas";
            Sk.pre = "edoutput";
            if (editor.getValue().indexOf('turtle') > -1 ) {
                $('#mycanvas').show();
            }
            try {
                Sk.misceval.asyncToPromise(function() {
                    return Sk.importMainWithBody("<stdin>",false,editor.getValue(),true);
                });
            } catch(e) {
                outf(e.toString() + "\n");
            }
        }
    };
    function check_syntax(code, result_cb){
    var error_list = [{
            line_no: 1,
            column_no_start: 14,
            column_no_stop: 17,
            fragment: "def doesNothing:\n",
            message: "invalid syntax",
            severity: "error"
        }, {
            line_no: 4,
            column_no_start: 1,
            column_no_stop: 3,
            fragment: "a__ = 5\n",
            message: "convention violation",
            severity: "warning"
        }];

    result_cb(error_list);
}


    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        //parserfile: ["parsepython.js"],
        autofocus: true,
        theme: "the-matrix",
        //path: "static/env/codemirror/js/",
        lineNumbers: true,
        textWrapping: false,
        gutters: ["CodeMirror-lint-markers"],
        indentUnit: 4,
        height: "160px",
        fontSize: "9pt",
        autoMatchParens: true,
        parserConfig: {'pythonVersion': 3, 'strictErrors': true},
        lint: {
        "getAnnotations": python_validator,
        "async": true,
        "check_cb": check_syntax
    }
    });
   
    $("#skulpt_run").click(function (e) { keymap["Ctrl-Enter"](editor)} );

    $("#toggledocs").click(function (e) {
        $("#quickdocs").toggle();
    });

    var exampleCode = function (id, text) {
        $(id).click(function (e) {
            editor.setValue(text);
            editor.focus(); // so that F5 works, hmm
        });
    };

    $('#clearoutput').click(function (e) {
        $('#edoutput').text('');
        $('#mycanvas').hide();
    });


    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    }

    editor.focus();
});
