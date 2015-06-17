'use strict';

const TestUtils = require('react/lib/ReactTestUtils');
const {getSelection, setSelection} = require('../src/SelectionUtils');

function simulateChange(node, content) {
  let {start, end} = getSelection(node);
  let newVal = node.value.substring(0, start) + content + node.value.substr(end);

  node.value = newVal;
  setSelection(node, start + content.length, start + content.length);
  TestUtils.Simulate.change(node, {target: node});
}

function simulateKeyPress(node, key) {
  let defaultPrevented = false;
  TestUtils.Simulate.keyPress(node, {
    key,
    preventDefault: () => defaultPrevented = true
  });

  if (!defaultPrevented && key.length === 1) {
    simulateChange(node, key);
  }
}

function simulateTyping(node, content) {
  content.split('').forEach(key => simulateKeyPress(node, key));
}

function simulateKeyDown(node, key) {
  let defaultPrevented = false;
  TestUtils.Simulate.keyDown(node, {
    key,
    preventDefault: () => defaultPrevented = true
  });

  if (!defaultPrevented) {
    let {start, end} = getSelection(node);
    let prevVal = node.value;
    let newVal;
    if (start === end) {
      if (key === 'Backspace') {
        newVal = prevVal.substring(0, start - 1) + prevVal.substr(end);
      }
      else if (key === 'Delete') {
        newVal = prevVal.substring(0, start) + prevVal.substr(end + 1);
      }
    }
    else {
      newVal = prevVal.substring(0, start) + prevVal.substr(end);
    }

    node.value = newVal;
    setSelection(node, start, start);
    TestUtils.Simulate.change(node, {target: node});
  }
}

function simulateFocus(node, cb) {
  TestUtils.Simulate.focus(node);
  setSelection(node, node.value.length, node.value.length);
  setTimeout(cb, 0);
}

module.exports = {
  simulateChange,
  simulateKeyPress,
  simulateTyping,
  simulateKeyDown,
  simulateFocus
};
