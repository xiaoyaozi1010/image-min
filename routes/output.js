const fs = require('fs-extra');
const path = require('path');
const { makeResult } = require('../utils/helper');
module.exports = function (req, res, next) {
    const {dirpath, filename} = req.params;
    const filePath = path.join(process.cwd(), 'output', dirpath, filename);
    fs.pathExists(filePath)
        .then(exist => {
            if (exist)  res.download(filePath);
            else res.json(makeResult('not-exist', '文件不存在或者已经被删除', {}));
        })
        .catch(err => {
            console.log(err);
            res.json(makeResult('', '服务器发生错误，请尝试重新下载', {}))
        });
};