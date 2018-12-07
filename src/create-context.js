import { directive } from './lit.js';
import { contextEvent } from './symbols.js';
import { useContext } from './use-context.js';
import { component } from './component.js';

export const createContext = (defaultValue) => {
  const Context = {};
  
  const providers = new WeakMap();
  const templates = new WeakMap();

  // can be composed like
  // ThemeContext.Provider
  Context.Provider = value => directive(template => (part) => {
    template.set(this, template);
    part.setValue(template);
    part.commit();

    let provider = providers.get(this); 
    if (!) {
      const provider = createProvider(value);

      let current = part.startNode;
      while (current !== part.endNode) {
        current.__contexts = current.__contexts || [];
        current.__contexts.push(provider);
        current = current.nextSibling;
      }
    } else {
      provider.set(value);
    }
  });

  Context.Consumer = component(function ({ render }) {
    const context = useContext(Context);

    return render(context);
  });

  Context.defaultValue = defaultValue;

  return Context;
}

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));