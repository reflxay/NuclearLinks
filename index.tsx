import definePlugin from "@utils/types";
import { FluxDispatcher } from "@webpack/common";

let interceptor: (e: any) => void;

export default definePlugin({
    name: "NuclearLinks",
    description: "Turns 5 and 6 digit nuclear codes into clickable links for easy access.",
    authors: [{ name: "Reflexay", id: BigInt("232309534532698114") }],

    start() {
        interceptor = (e: any) => {
            if (e.type === "MESSAGE_CREATE" || e.type === "MESSAGE_UPDATE" || e.type === "LOAD_MESSAGES_SUCCESS") {
                const messages = e.type === "LOAD_MESSAGES_SUCCESS" ? e.messages : [e.message];
                messages.forEach((msg: any) => {
                    if (msg && msg.content) {
                        msg.content = this.transformContent(msg.content);
                    }
                });
            }
        };
        FluxDispatcher.addInterceptor(interceptor);
    },

    stop() {
        const index = FluxDispatcher._interceptors.indexOf(interceptor);
        if (index > -1) {
            FluxDispatcher._interceptors.splice(index, 1);
        }
    },

    transformContent(content: string): string {
        const regex = /\b(\d{5,6})\b/g;
        return content.replace(regex, (match) => `[${match}](https://nhentai.net/g/${match}/)`);
    }
});