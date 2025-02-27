import { helloWorld } from './hello-world';

describe('Hello World', () => {
  it('should return the greeting message', () => {
    expect(helloWorld()).toBe('Hello, Professional Release Workflow!');
  });
});