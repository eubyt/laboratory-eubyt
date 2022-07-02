// Factory
function Testando<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        private msg = 'Testando';
      };
}


@Testando
class Teste {
    constructor() {  }
}

console.log(new Teste().msg)