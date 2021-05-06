import {Queue} from './queue';

interface State {
  missionaries: number;
  cannibals: number;
  boat: boolean;
}

interface Operator {
  missionaries: number;
  cannibals: number;
}

interface StateTreeNode {
  state: State;
  operator: Operator | null;
  parent: StateTreeNode | null;
  children: StateTreeNode[];
}

const NUM_MISSONARIES = 3;
const NUM_CANNIBALS = 3;
const MIN_PASSENGERS = 1;
const MAX_PASSENGERS = 2;

function isValidState(state: State): boolean {
  const {missionaries, cannibals} = state;

  if (
    missionaries < 0 ||
    missionaries > NUM_MISSONARIES ||
    cannibals < 0 ||
    cannibals > NUM_CANNIBALS
  ) {
    return false;
  }

  if (missionaries > 0 && missionaries < cannibals) {
    return false;
  }

  if (
    NUM_MISSONARIES - missionaries > 0 &&
    NUM_MISSONARIES - missionaries < NUM_CANNIBALS - cannibals
  ) {
    return false;
  }

  return true;
}

function isAcceptState(state: State): boolean {
  const {missionaries, cannibals} = state;

  return missionaries === 0 && cannibals === 0;
}

function isValidOperator(operator: Operator, state: State): boolean {
  const {missionaries, cannibals} = operator;

  const passengers = missionaries + cannibals;
  if (passengers < MIN_PASSENGERS || passengers > MAX_PASSENGERS) {
    return false;
  }

  const maxMissonaries = state.boat
    ? state.missionaries
    : NUM_MISSONARIES - state.missionaries;
  if (missionaries < 0 || missionaries > maxMissonaries) {
    return false;
  }

  const maxCannibals = state.boat
    ? state.cannibals
    : NUM_CANNIBALS - state.cannibals;
  if (cannibals < 0 || cannibals > maxCannibals) {
    return false;
  }

  return true;
}

function* enumerateValidOperators(state: State) {
  for (let m = 0; m <= NUM_MISSONARIES; m++) {
    for (let c = 0; c <= NUM_CANNIBALS; c++) {
      const operator: Operator = {missionaries: m, cannibals: c};
      if (isValidOperator(operator, state)) {
        yield operator;
      }
    }
  }
}

function computeUniqueIndexNumber(state: State): number {
  const {missionaries, cannibals, boat} = state;

  return (
    missionaries * (NUM_CANNIBALS + 1) * 2 + cannibals * 2 + (boat ? 1 : 0)
  );
}

function operate(operator: Operator, state: State): State {
  const {missionaries, cannibals, boat} = state;

  const newState: State = {
    missionaries: boat
      ? missionaries - operator.missionaries
      : missionaries + operator.missionaries,
    cannibals: boat
      ? cannibals - operator.cannibals
      : cannibals + operator.cannibals,
    boat: !boat,
  };

  return newState;
}

function logState(state: State) {
  const {missionaries, cannibals, boat} = state;

  console.log(
    ' '.repeat(NUM_MISSONARIES - missionaries) +
      'o'.repeat(missionaries) +
      'x'.repeat(cannibals) +
      ' '.repeat(NUM_CANNIBALS - cannibals) +
      ` |${boat ? '⛵        ' : '        ⛵'}| ` +
      ' '.repeat(missionaries) +
      'o'.repeat(NUM_MISSONARIES - missionaries) +
      'x'.repeat(NUM_CANNIBALS - cannibals) +
      ' '.repeat(cannibals)
  );
}

function logStatePath(node: StateTreeNode | null) {
  const states: State[] = [];

  while (node !== null) {
    states.unshift(node.state);
    node = node.parent;
  }

  console.log(`Depth: ${states.length}`);
  console.log('--------------------------------');

  states.forEach(state => {
    logState(state);
  });
}

function solve(): StateTreeNode[] {
  const initialState: State = {
    missionaries: NUM_MISSONARIES,
    cannibals: NUM_CANNIBALS,
    boat: true,
  };

  const root: StateTreeNode = {
    state: initialState,
    operator: null,
    parent: null,
    children: [],
  };

  const visitedState = Array.from({
    length: (NUM_MISSONARIES + 1) * (NUM_CANNIBALS + 1) * 2,
  }).fill(false);
  visitedState[computeUniqueIndexNumber(initialState)] = true;

  const itemQueue = new Queue<StateTreeNode>();
  itemQueue.push(root);

  const acceptItems: StateTreeNode[] = [];

  while (itemQueue.length > 0) {
    const item = itemQueue.peek();
    itemQueue.pop();

    for (const operator of enumerateValidOperators(item.state)) {
      const newState = operate(operator, item.state);

      const newItem: StateTreeNode = {
        state: newState,
        operator,
        parent: item,
        children: [],
      };
      item.children.push(newItem);

      const acceptable = isAcceptState(newState);
      const valid = isValidState(newState);
      const visited = visitedState[computeUniqueIndexNumber(newState)];

      if (acceptable) {
        acceptItems.push(newItem);
      }

      if (!acceptable && valid && !visited) {
        itemQueue.push(newItem);
      }

      visitedState[computeUniqueIndexNumber(newState)] = true;
    }
  }

  return acceptItems;
}

function run() {
  const acceptItems = solve();

  console.log('================================');
  for (const acceptItem of acceptItems) {
    logStatePath(acceptItem);
    console.log('================================');
  }
  console.log(`Found ${acceptItems.length} irreducible paths.`);
}

run();
