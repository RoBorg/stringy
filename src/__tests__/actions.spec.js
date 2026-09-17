import { describe, it, expect } from 'vitest';
import { actions, types } from '../actions';

describe('actions registry', () => {
  it('gives every action a unique name and a component with a canParse function', () => {
    const names = actions.map(action => action.name);

    expect(new Set(names).size).toBe(names.length);

    for (const action of actions) {
      expect(typeof action.component.canParse).toBe('function');
      expect(Object.keys(types)).toContain(action.type);
    }
  });
});
