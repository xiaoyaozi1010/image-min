const config = require('./config');
const url = require('url');
const fs = require('fs');
module.exports = {
    makeResult(status = 0, msg = '', data = {}) {
        return {
            code: config.RESPONSE_STATUS_MAP[status],
            data,
            msg
        }
    },
    getFullUrl(req) {
        return url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
        })
    },
    getFileSize (path, unit = '') {
        const size = fs.statSync(path).size;
        let divisor = 1;
        if(unit === 'kb') {
            divisor = 1000;
        }
        else if(unit === 'mb') {
            divisor = 1000000;
        }
        return Math.round(size/divisor);
    }
};
