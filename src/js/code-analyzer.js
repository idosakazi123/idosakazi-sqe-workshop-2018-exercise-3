import * as esprima from 'esprima';
import * as esgraph from 'esgraph';
import * as escodegen from 'escodegen';


let graphModel = {
    'vertices' : [[]],
    'vertexKind' : [[]],
    'arcs' : [[]],
};

let localVariables = {
    'modelArray' : [],
    'modelString' : '',
};

let conditionExpression = ['Literal','Identifier','BinaryExpression', 'MemberExpression','UnaryExpression','ArrayExpression','LogicalExpression'];

function resetGraphModelVariables(){
    graphModel.vertices = [[]];
    graphModel.vertexKind = [[]];
    graphModel.arcs = [[]];

}

function resetLocalVariablesVariables(){
    localVariables.modelArray = [];
    localVariables.modelString = '';
}

function parseCode(codeToParse){
    return esprima.parse(codeToParse ,{range: true});
}

function mapParseCodeToIndex(parsedCode){
    return parsedCode.body.map((variable , index) => {
        if (variable.type === 'FunctionDeclaration') {
            return index;
        } else {
            return -1;
        }
    });
}

function filterParseCodeToIndex(functionIndex){
    return functionIndex.filter((variable) => variable !== -1)[0];
}

function createGraph(codeToParse,inputVector){
    resetGraphModelVariables();resetLocalVariablesVariables();
    let parsedCode = parseCode(codeToParse);
    let functionIndex = mapParseCodeToIndex(parsedCode);
    functionIndex = filterParseCodeToIndex(functionIndex);
    insertGlobalVariablesIntoModelString(parsedCode.body , functionIndex);
    localVariables.modelString = localVariables.modelString + createParametersToStr(parsedCode.body[functionIndex].params , inputVector + '');
    createGraphModel(codeToParse , parsedCode.body[functionIndex]);
    localVariables.modelArray.push( returnArray(graphModel.vertices,3));
    if(graphModel.arcs[0].length !== 0)
        checkNextVertex(returnArray(graphModel.arcs,2));

    graphModel.vertices = paintGraphModelVertices();
    graphModel.arcs = graphModel.arcs[0].map((arc) => arc.join(' '));
    return graphModel.vertices.concat(graphModel.arcs).join(' ');
}

function paintGraphModelVertices(){
    let verticesPaint = graphModel.vertices[0].map((vertex ) => {
        if(localVariables.modelArray.includes(vertex[0]))
            return [vertex[0] , printBox(vertex , 'color=green, style=filled')];
        else
            return vertex;
    });
    verticesPaint = verticesPaint.slice(0,graphModel.vertices[0].length - 1);
    graphModel.vertices[0] = verticesPaint.map((vertex , index) =>
    {return [vertex[0] , writeNumberInBox(vertex , index+1)];});

    return  graphModel.vertices[0].map((x) => {
        if(checkIfTerm(x[0]))
            return  [x[0] , '[' + printBox(x , 'shape=diamond')].join(' ');
        else
            return [x[0] , '[' + printBox(x , 'shape=box')].join(' ');
    });
}

function returnArray(arr,index){
    if(index === 3){
        return arr[0][0][0];
    }else{
        return arr[0][0];
    }
}

function createParametersToStr(argument , parameters) {
    let parametersSplit = parameters.split(',');
    let parametersSplitMap = parametersSplit.map((param) =>
        param.trim()
    );
    return argument.map((arg, index) =>
        'let ' + arg.name + ' ' + '=' + ' ' + parametersSplitMap[index] + ';').join(' ');
}

function takeLastVertex(ver){
    let verFilter = ver.filter((specificVer) => specificVer.includes('label="exit"'))[0];
    return verFilter.split(' ')[0];
}

function takeArcsOfVertex(vertex){
    let arc = graphModel.arcs[0];
    let arcFilter = arc.filter((x) =>
        x[0] === vertex
    );
    return arcFilter[0];
}

function checkIfArcsIsFalse(vertex){
    let arc = graphModel.arcs[0];
    let arcFilter = arc.filter((x) =>
        x[0] === vertex
    );
    return arcFilter[1];
}

function takeASpecificPartInStr(ans,index,size){
    return  ans.slice(index,size);
}

function getStatement(vertexType , vertex){
    let checkVertex = vertexType.filter((x) =>
        x.includes(vertex + ' [')
    );
    let checkVertexSplit = checkVertex[0].split(' [')[1];
    return takeASpecificPartInStr(checkVertexSplit, 7, checkVertexSplit.length - 2);
}

function checkIfTerm(vertex){
    return conditionExpression.includes(getStatement(graphModel.vertexKind[0], vertex));
}

function takeInformationOnVertex(vertex){
    let getVertices = graphModel.vertices[0];
    let checkVertex = getVertices.filter((x) => x[0] === vertex)[0];
    let checkVertexSlice  =  checkVertex.slice(1).join(' [');
    let specVertex = takeASpecificPartInStr(checkVertexSlice,7,checkVertexSlice.length - 2);
    if(specVertex.charAt(specVertex.length - 1) !== ';'){
        return specVertex + ';';
    }else{
        return specVertex;
    }
}

function createGraphModel(functionCode , functionParseCode){
    let graphFunctionCode = esgraph(functionParseCode.body);
    graphModel.vertices[0] = esgraph.dot(graphFunctionCode, {counter: 0, source: functionCode}).split('\n');
    graphModel.vertexKind[0] = esgraph.dot(graphFunctionCode).split('\n');

    takeOffTheFirstNode();

    typesForVertexKindAndArcForArcs();

    takeTheArraysAndDoSpace();

}

function takeOffTheFirstNode(){
    graphModel.vertexKind[0] = graphModel.vertexKind[0].filter((verKind) =>
        !verKind.includes('n0') && !verKind.includes('n' + takeLastVertex(graphModel.vertexKind[0])) && !verKind.includes('exception')
    );
    graphModel.vertices[0] = graphModel.vertices[0].filter((vertex) =>
        !vertex.includes('n0') && !vertex.includes(takeLastVertex(graphModel.vertices[0])) && !vertex.includes('exception')
    );
}

function typesForVertexKindAndArcForArcs(){
    graphModel.vertexKind[0] = graphModel.vertexKind[0].filter((verKind) =>
        !verKind.includes('->')
    );
    graphModel.arcs[0] = graphModel.vertices[0].filter((arc) =>
        arc.includes('->')
    );
}

function takeTheArraysAndDoSpace(){
    graphModel.arcs[0] = graphModel.arcs[0].map((arc) =>
        arc.split(' ')
    );
    graphModel.vertices[0] = graphModel.vertices[0].filter((vertex) =>
        !vertex.includes('->')
    );
    graphModel.vertices[0] = graphModel.vertices[0].map((vertex) =>
        vertex.split(' [')
    );
}


function insertToModelString(vertex){
    let str = ' ' + takeInformationOnVertex(vertex);
    localVariables.modelString =  localVariables.modelString + str;
}

function printBox(vertex , print ){
    let vertexSlice = vertex.slice(1).join(' [');
    vertexSlice = takeASpecificPartInStr(vertexSlice,0,vertexSlice.length - 1);
    vertexSlice = vertexSlice  + ' , ' + print + ']';
    return vertexSlice;
}

function writeNumberInBox(vertex , index ){
    let str;
    vertex = vertex.slice(1).join(' [');
    let vertexSlice = takeASpecificPartInStr(vertex,0,7);
    str = vertexSlice + '';
    str = str +  index + '\n';
    str = str + takeASpecificPartInStr(vertex,7,vertex.length);
    return str;
}

function insertGlobalVariablesIntoModelString(globalVariables , functionIn){
    globalVariables.map((variable , index) => {
        if(index < functionIn) {
            localVariables.modelString = localVariables.modelString + escodegen.generate(variable);
        }
    });
}

function checkNextVertex(vertex){
    let nextVertexIn;
    insertToModelString(vertex[0]);
    if(!eval(localVariables.modelString) && checkIfTerm(vertex[0])) {
        let falseArcsVertex = checkIfArcsIsFalse(vertex[0]);
        nextVertexIn = isConditionExpression(vertex,falseArcsVertex);
        if(nextVertexIn === undefined) {
            localVariables.modelArray.push(falseArcsVertex[2]);
            return;
        }
    }else{
        nextVertexIn =  isNotConditionExpression(vertex);
        if(nextVertexIn === undefined) {
            localVariables.modelArray.push(vertex[2]);
            return;
        }
    }
    checkNextVertex(nextVertexIn);
}

function isConditionExpression(vertex,falseArcsVertex){
    localVariables.modelArray.push(vertex[0]);
    return takeArcsOfVertex(falseArcsVertex[2]);
}

function isNotConditionExpression(vertex){
    if(localVariables.modelArray.includes(vertex[2])){
        localVariables.modelArray.push(vertex[0]);
        return;
    }else{
        localVariables.modelArray.push(vertex[0]);
        return takeArcsOfVertex(vertex[2]);
    }
}



export {createGraph};
