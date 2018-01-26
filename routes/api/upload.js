const path = require('path');
const fs = require('fs-extra');
const pureFs = require('fs');
const formidable = require('formidable');
const imagemin = require('imagemin');
const imageminPng = require('imagemin-pngquant');
const imageminJpg = require('imagemin-mozjpeg');
const imageminGif = require('imagemin-gifsicle');
const decompress = require('decompress');
const archiver = require('archiver');
const timestamp = require('time-stamp');
const { makeResult, getFileSize } = require('../../utils/helper');

const allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const output_dir = path.join(process.env.PWD, '/output/');
const upload_dir = path.join(process.env.PWD, '/uploads/');
const temp_dir = path.join(process.env.PWD, '/temps/');

module.exports = function(req, res, next) {
    const form = new formidable.IncomingForm();
    const time_stamp = timestamp('YYYYMMDDHH_mmss');
    const upload_time_stamp_dir = path.join(upload_dir, time_stamp); // 上传目录
    const temp_time_stamp_dir = path.join(temp_dir, time_stamp); // 临时存储目录
    const output_time_stamp_dir = path.join(output_dir, time_stamp); // 输出目录
    form.parse(req, (err, fields, files) => {
        let file = files.file;
        let file_path = file.path,
            file_ext = file.name.split('.').pop(),
            file_name = file.name,
            upload_path = path.join(upload_time_stamp_dir, file_name);
        // 无法识别的格式
        if(allowed_ext.indexOf(file_ext) < 0 && file_ext.toLowerCase() !== 'zip') {
            res.json(makeResult('error', '不支持的文件格式', {}));
            return ;
        }
        // 创建目录
        fs.ensureDirSync(upload_time_stamp_dir);
        fs.ensureDirSync(temp_time_stamp_dir);
        fs.ensureDirSync(output_time_stamp_dir);
        // 转存到upload目录里
        pureFs.renameSync(file_path, upload_path);
        // zip
        if(file_ext.toLowerCase() === 'zip') {
            const output_file_path = path.join(output_time_stamp_dir, file_name);
            // 解压至upload内
            zipHandler(upload_path, temp_time_stamp_dir)
                .then(files => {
                    let all_files_path = files.map(_ => path.join(temp_time_stamp_dir, _.path));
                    return imageHandler(all_files_path, temp_time_stamp_dir)
                })
                .then(() => {
                    return compressDir2Zip(temp_time_stamp_dir, output_file_path)
                })
                .then(e => {
                    const size = getFileSize(output_file_path);
                    return res.json(makeResult('success', 'upload success', {
                        url: path.relative(process.cwd(), output_file_path),
                        size
                    }));
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            upload_path = [upload_path];
            // 单个image
            imageHandler(upload_path, output_time_stamp_dir)
                .then(files => {
                    const output_file_path = files[0].path;
                    const size = getFileSize(output_file_path);
                    return res.json(makeResult('success', 'upload success', {
                        url: path.relative(process.cwd(), output_file_path),
                        size
                    }));
                })
                .catch(err => {
                    console.log(err)
                })
        }
    });
};

/**
 * 解压zip
 * @param file_path
 * @param output_dir
 * @returns {Promise}
 */
function zipHandler(file_path, output_dir) {
    return decompress(file_path, output_dir, {
        filter: file => allowed_ext.indexOf(path.extname(file.path).split('.')[1]) >= 0 &&
            file.path.indexOf('__MACOSX/') < 0,
        strip: 2
    })
}

/**
 * 返回一个压缩过的文件
 * @param file_path 输入文件
 * @param output_dir 输出目录
 * @returns {Promise}
 */
function imageHandler(file_path, output_dir) {
    return imagemin(file_path, output_dir, {
        use: [
            imageminPng({ quality: '60'}),
            imageminJpg({quality: 50 }),
            imageminGif({optimizationLevel: 2})
        ]
    });
}

/**
 * 压缩zip
 * @param input_dir 输入目录
 * @param output_path 输出文件
 */
function compressDir2Zip(input_dir, output_path) {
    let output = pureFs.createWriteStream(output_path);
    let archive = archiver('zip', {
        zlib: {level: 8}
    });
    
    archive.pipe(output);
    archive.directory(input_dir, false);
    archive.finalize();
    return new Promise((resolve, reject) => {
        output.on('close', e => {
            console.log(archive.pointer() + ' total bytes');
            resolve(e)
        });
        archive.on('error', err => {
            reject(err)
        });
    })
}
