import {mkdir} from 'fs/promises';
import {digraph, Graph, RenderOptions} from 'graphviz';

function makeGraph(): Graph {
  const g = digraph('G');

  g.addNode('Hello');
  g.addNode('World');
  g.addEdge('Hello', 'World');

  const sub = g.addCluster('cluster_0');
  sub.set('label', 'a');
  sub.set('fillcolor', '#333333');
  sub.addEdge('1', '2');

  return g;
}

async function run() {
  const g = makeGraph();

  console.log(g.to_dot());

  const options: RenderOptions = {
    type: 'svg',
    G: {
      bgcolor: '#222222',
      fontcolor: '#C6C5FE',
      fontname: 'Arial',
      layout: 'dot',
      overlap: false,
      pad: 0.3,
      rankdir: 'LR',
      style: 'filled',
    },
    E: {
      color: '#757575',
    },
    N: {
      color: '#C6C5FE',
      fontcolor: '#C6C5FE',
      fontname: 'Arial',
      fontsize: '14px',
      height: 0,
      shape: 'box',
      style: 'rounded',
    },
  };

  await mkdir('out', {recursive: true});
  g.output(options, 'out/test01.svg');
}

run();
