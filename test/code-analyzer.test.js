import assert from 'assert';
import {createGraph} from '../src/js/code-analyzer';

describe('natural function', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(z){\nreturn z;\n}','3')),
            '"n1 [label=\\"1\\nreturn z;\\" , color=green, style=filled , shape=box]"'
        );
    });

});

describe('simple if', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(x){\nlet a = x + 1;\nlet c = 0;\nif(c < x) {\nc = a + c + x;  \n}\nreturn c;\n}','2')),
            '"n1 [label=\\"1\\nlet a = x + 1;\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet c = 0;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nc < x\\" , color=green, style=filled , shape=diamond] n4 [label=\\"4\\nc = a + c + x\\" , color=green, style=filled , shape=box] n5 [label=\\"5\\nreturn c;\\" , color=green, style=filled , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [label=\\"true\\"] n3 -> n5 [label=\\"false\\"] n4 -> n5 []"'
        );
    });

});

describe('simple while', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(x){\nlet a = x + 1;\nlet c = 0;\nwhile(c < x) {\nc = a + c + x;  \n}\nreturn c;\n}','2')),
            '"n1 [label=\\"1\\nlet a = x + 1;\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet c = 0;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nc < x\\" , color=green, style=filled , shape=diamond] n4 [label=\\"4\\nc = a + c + x\\" , color=green, style=filled , shape=box] n5 [label=\\"5\\nreturn c;\\" , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [label=\\"true\\"] n3 -> n5 [label=\\"false\\"] n4 -> n3 []"'
        );
    });

});

describe('function with while and two global variables', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(x,y){\nlet a = x + 1;\nlet c = 0;\nwhile(c <y) {\nc = a + c + x;  \n}\nreturn c;\n}','2,3')),
            '"n1 [label=\\"1\\nlet a = x + 1;\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet c = 0;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nc <y\\" , color=green, style=filled , shape=diamond] n4 [label=\\"4\\nc = a + c + x\\" , color=green, style=filled , shape=box] n5 [label=\\"5\\nreturn c;\\" , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [label=\\"true\\"] n3 -> n5 [label=\\"false\\"] n4 -> n3 []"'
        );
    });

});

describe('check first function example', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(x, y, z){\nlet a = x + 1;\nlet b = a + y;\nlet c = 0;\n\nif (b < z) {\nc = c + 5;\n} else if (b < z * 2) {\nc = c + x + 5;\n} else {\nc = c + z + 5;\n}\n\nreturn c;\n}','1,2,3')),
            '"n1 [label=\\"1\\nlet a = x + 1;\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet b = a + y;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nlet c = 0;\\" , color=green, style=filled , shape=box] n4 [label=\\"4\\nb < z\\" , color=green, style=filled , shape=diamond] n5 [label=\\"5\\nc = c + 5\\" , shape=box] n6 [label=\\"6\\nreturn c;\\" , color=green, style=filled , shape=box] n7 [label=\\"7\\nb < z * 2\\" , color=green, style=filled , shape=diamond] n8 [label=\\"8\\nc = c + x + 5\\" , color=green, style=filled , shape=box] n9 [label=\\"9\\nc = c + z + 5\\" , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [] n4 -> n5 [label=\\"true\\"] n4 -> n7 [label=\\"false\\"] n5 -> n6 [] n7 -> n8 [label=\\"true\\"] n7 -> n9 [label=\\"false\\"] n8 -> n6 [] n9 -> n6 []"'
        );
    });

});

describe('check the second function in example', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(x, y, z){\nlet a = x + 1;\nlet b = a + y;\nlet c = 0;\n\nwhile (a < z) {\nc = a + b;\nz = c * 2;\na++;\n}\n\nreturn z;\n}','1,2,3')),
            '"n1 [label=\\"1\\nlet a = x + 1;\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet b = a + y;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nlet c = 0;\\" , color=green, style=filled , shape=box] n4 [label=\\"4\\na < z\\" , color=green, style=filled , shape=diamond] n5 [label=\\"5\\nc = a + b\\" , color=green, style=filled , shape=box] n6 [label=\\"6\\nz = c * 2\\" , color=green, style=filled , shape=box] n7 [label=\\"7\\na++\\" , color=green, style=filled , shape=box] n8 [label=\\"8\\nreturn z;\\" , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [] n4 -> n5 [label=\\"true\\"] n4 -> n8 [label=\\"false\\"] n5 -> n6 [] n6 -> n7 [] n7 -> n4 []"'
        );
    });

});

describe('function with if true', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(x, y, z){\nlet b = 5 + y;\nlet c = 0;\n\nif (b < z) {\nc = z + 5;\n} \n\nreturn c;\n}\n','1,2,12')),
            '"n1 [label=\\"1\\nlet b = 5 + y;\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet c = 0;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nb < z\\" , color=green, style=filled , shape=diamond] n4 [label=\\"4\\nc = z + 5\\" , color=green, style=filled , shape=box] n5 [label=\\"5\\nreturn c;\\" , color=green, style=filled , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [label=\\"true\\"] n3 -> n5 [label=\\"false\\"] n4 -> n5 []"'
        );
    });

});

describe('function with if true', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('function foo(x, y, z){\nlet b = 5 + y;\nlet c = 0;\n\nif (b < z) {\nc = z + 5;\n} \n\nreturn c;\n}\n','1,2,12')),
            '"n1 [label=\\"1\\nlet b = 5 + y;\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet c = 0;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nb < z\\" , color=green, style=filled , shape=diamond] n4 [label=\\"4\\nc = z + 5\\" , color=green, style=filled , shape=box] n5 [label=\\"5\\nreturn c;\\" , color=green, style=filled , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [label=\\"true\\"] n3 -> n5 [label=\\"false\\"] n4 -> n5 []"'
        );
    });

});

describe('function with while false and assignment global variable outside the function', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('let a =6\nfunction foo(x, y, z){\na = x + 1;\nlet b = a + y;\nlet c = 0;\nwhile (a < z) {\nc = a + b;\nz = c * 2;\na++;\n}\nreturn z;\n}','1,2,1')),
            '"n1 [label=\\"1\\na = x + 1\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nlet b = a + y;\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nlet c = 0;\\" , color=green, style=filled , shape=box] n4 [label=\\"4\\na < z\\" , color=green, style=filled , shape=diamond] n5 [label=\\"5\\nc = a + b\\" , shape=box] n6 [label=\\"6\\nz = c * 2\\" , shape=box] n7 [label=\\"7\\na++\\" , shape=box] n8 [label=\\"8\\nreturn z;\\" , color=green, style=filled , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [] n4 -> n5 [label=\\"true\\"] n4 -> n8 [label=\\"false\\"] n5 -> n6 [] n6 -> n7 [] n7 -> n4 []"'
        );
    });

});

describe('function with while false and assignment global variable outside the function and array in input vector', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(createGraph('let a =6;\nlet b=2;\nfunction foo(x, y, z){\na = x[0] + 1;\nb = a + y;\nlet c = 0;\nwhile (a < z) {\nc = a + b;\nz = c * 2;\na++;\n}\nreturn z;\n}','[1],2,13')),
            '"n1 [label=\\"1\\na = x[0] + 1\\" , color=green, style=filled , shape=box] n2 [label=\\"2\\nb = a + y\\" , color=green, style=filled , shape=box] n3 [label=\\"3\\nlet c = 0;\\" , color=green, style=filled , shape=box] n4 [label=\\"4\\na < z\\" , color=green, style=filled , shape=diamond] n5 [label=\\"5\\nc = a + b\\" , color=green, style=filled , shape=box] n6 [label=\\"6\\nz = c * 2\\" , color=green, style=filled , shape=box] n7 [label=\\"7\\na++\\" , color=green, style=filled , shape=box] n8 [label=\\"8\\nreturn z;\\" , shape=box] n1 -> n2 [] n2 -> n3 [] n3 -> n4 [] n4 -> n5 [label=\\"true\\"] n4 -> n8 [label=\\"false\\"] n5 -> n6 [] n6 -> n7 [] n7 -> n4 []"'
        );
    });

});





