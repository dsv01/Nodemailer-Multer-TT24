import multer from "multer";
import path from "path";

//Configuração de storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
    	let dest;
		if(file.mimetype.startsWith("video/")) {
			dest = path.join(__dirname, "..", "..", "uploads", "videos");
		} else if(file.mimetype.startsWith("audio/")) {
			dest = path.join(__dirname, "..", "..", "uploads", "audios");
		} else {
			dest = path.join(__dirname, "..", "..", "uploads", "photos");
		}
		cb(null, dest);
	},
  	filename: function (req, file, cb) {
        const {id} = req.params;
  		cb(null, Date.now() + "-user" + id + "-" + file.originalname);
        //   cb(null, Date.now() + "-" + file.originalname);
  	}
});


//Configurações de multer para imagens
const photoUpload = multer({

    storage: storage,
    limits: {
        //10MB e ate 4 arquivos
        fileSize: 10 * 1024 * 1024,
        files: 4
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ["image/jpeg", 
            "image/jpg", "image/png"];
        if(!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Apenas arquivos .jpg, .jpeg e .png são suportados"));
        }
        cb(null, true);
    }

});

//Configurações de multer para videos
const videoUpload = multer({

    storage: storage,
    limits: {
        //100MB
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        if(file.mimetype.startsWith("video/mp4")) {
            cb(null, true);
        } else {
            cb(new Error("Apenas arquivos .mp4 são suportados"));
        }
    }

});

//Configurações de multer para audios
const audioUpload = multer({

    storage: storage,
    limits: {
        //50MB
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        if(extname == ".mp3") {
            cb(null, true);
        } else {
            cb(new Error("Apenas arquivos .mp3 são suportados"));
        }
    }

});

/**
 * upload de multiplos arquivos genericos
 * alternativa ao uso de uploads diferentes para diferentes tipos de midia
 */
// const upload = multer({

//     storage: storage,
//     limits: {
//         fileSize: 100 * 1024 * 1024,
//         files: 4
//     },
//     fileFilter: function (req, file, cb) {
//         const extname = path.extname(file.originalname);
//         if(extname != ".mp3" || extname != ".mp4" || extname != ".jpg" || 
//             extname != ".jpeg" || extname != ".png") {
//             cb(new Error("Arquivo(s) não suportado(s)"));  
//         } else {
//             cb(null, true);
//         }
//     }

// });

export {photoUpload, audioUpload, videoUpload};