import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "./bootstrap";

createInertiaApp({
    resolve: async (name) => {
        try {
            return (await import(`./Pages/${name}.jsx`)).default;
        } catch (e) {
            const [moduleName, ...pageParts] = name.split("/");
            const pageName = pageParts.join("/");

            if (!pageName) {
                throw e;
            }

            return (
                await import(
                    `../../Modules/${moduleName}/resources/Pages/${pageName}.jsx`
                )
            ).default;
        }
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
