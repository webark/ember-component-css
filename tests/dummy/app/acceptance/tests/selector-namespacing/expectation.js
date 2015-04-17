const MAGENTA = { color: 'rgb(255, 0, 255)' };
const GREEN = { color: 'rgb(0, 255, 0)' };
const BLUE = { color: 'rgb(0, 0, 255)' };
const CYAN = { color: 'rgb(0, 255, 255)' };

export default {
  styles: {
    '[data-component-text]': MAGENTA,
    '[data-namespaced-green]': GREEN,
    '[data-global-child]': CYAN,
    '[data-global-green]': MAGENTA,
    '[data-global-blue]': BLUE,
    '[data-namespaced-blue]': MAGENTA
  }
};
