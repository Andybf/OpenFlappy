
import('./canvas.js').then( ( appClassDefinition) => {
    customElements.define("cmp-canvas", appClassDefinition.default);

    import("./control.js").then( (Control) => {
        new Control.default(document.querySelector('cmp-canvas'));
    });
});