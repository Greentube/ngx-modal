var fs = require('fs');

fs.createReadStream('bundles/ngx-modal.umd.js').pipe(fs.createWriteStream('bundles/index.js'));