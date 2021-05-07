import {mkdir} from 'fs/promises';
import {digraph, Graph, RenderOptions} from 'graphviz';

function makeGraph(): Graph {
  const g = digraph('G');

  g.addNode('Hello');
  g.addNode('World');
  g.addEdge('Hello', 'World');

  return g;
}

async function run() {
  const g = makeGraph();

  console.log(g.to_dot());

  const options: RenderOptions = {
    type: 'svg',
    G: {
      overlap: false,
      pad: 0.3,
      rankdir: 'LR',
      layout: 'dot',
      bgcolor: '#222222',
    },
    E: {
      color: '#757575',
    },
    N: {
      fontname: 'Arial',
      fontsize: '14px',
      color: '#C6C5FE',
      shape: 'box',
      style: 'rounded',
      height: 0,
      fontcolor: '#C6C5FE',
    },
  };

  await mkdir('out', {recursive: true});
  g.output(options, 'out/test01.svg');
}

run();
