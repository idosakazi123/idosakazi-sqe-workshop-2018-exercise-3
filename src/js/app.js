import $ from 'jquery';
import Viz from 'viz.js';
import {createGraph} from './code-analyzer';
import { Module, render } from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let inputVector = $('#inputVector').val();

        let graph = createGraph(codeToParse,inputVector)
        let viz = new Viz({ Module, render });
        viz.renderString('digraph { ' +  graph + ' }')
            .then(function(result){
                document.getElementById('viewCodeGraph').innerHTML = result;
            });
    });
});

