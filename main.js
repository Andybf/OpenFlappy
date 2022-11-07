
import('./canvas.js').then( ( appClassDefinition) => {
    customElements.define("cmp-canvas", appClassDefinition.default);

    let subject;
    import("./subject.js").then( (Subject) => {
        subject = new Subject.default();
    });

    import("./control.js").then( (Control) => {
        new Control.default(subject, document.querySelector('cmp-canvas'));
    });
});