import esbuild from "esbuild"
import {sassPlugin} from "esbuild-sass-plugin";
import htmlPlugin from '@chialab/esbuild-plugin-html';
import esbuildServe from 'esbuild-serve';


esbuild
    .build({
        entryPoints: ["./src/scripts/wof.ts", "./src/styles/style.scss", "./src/index.html"],
        outdir: "./public",
        bundle: true,
        platform: 'node',
        plugins:[sassPlugin(), htmlPlugin()],
        loader: {
            '.ttf': 'dataurl'
        }
    })
    .then(()=> {
        esbuildServe({},{port: 3030, servedir:'./dist'}).then(()=> console.log("ES Build complete"))
    })
    .catch(()=> {process.exit(1),  console.log("ESBuild Failed")})
