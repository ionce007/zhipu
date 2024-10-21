const drawParamater = {
    style:  [
        {id: 0,key: "none",label: "无",cover: "/assets/img/styleCover.png",darkCover: "/assets/img/styleDarkCover.png",darkCoverActive: "/assets/img/styledarkCoverActive.png"},
        {id: 12,key: "photography",label: "摄影",cover: "/assets/img/stylePhotography.jpg?image_process=format,webp"},
        {id: 6,key: "ghibli",label: "吉卜力",cover: "/assets/img/styleGhibli.jpg?image_process=format,webp"},
        {id: 9,key: "van_gogh",label: "梵高",cover: "/assets/img/styleVan_gogh.jpg?image_process=format,webp"},
        {id: 8,key: "jap_anime",label: "日式动漫",cover: "/assets/img/styleJap_anime.jpg?image_process=format,webp"},
        {id: 13,key: "watercolor",label: "水彩",cover: "/assets/img/styleWatercolor.jpg?image_process=format,webp"},
        {id: 2,key: "cyberpunk",label: "赛博朋克",cover: "/assets/img/styleCyberpunk.jpg?image_process=format,webp"},
        {id: 3,key: "pixar",label: "皮克斯",cover: "/assets/img/stylePixar.png?image_process=format,webp"},
        {id: 10,key: "da_vinci",label: "达芬奇",cover: "/assets/img/styleDa_vinci.jpg?image_process=format,webp"},
        {id: 11,key: "oil_painting",label: "油画",cover: "/assets/img/styleOil_painting.jpg?image_process=format,webp"},
        {id: 1,key: "psychadelic",label: "多巴胺",cover: "/assets/img/stylePsychadelic.jpg?image_process=format,webp"},
        {id: 7,key: "line_art",label: "黑白线条",cover: "/assets/img/styleLine_art.jpg?image_process=format,webp"}
    ],
    ratio: [
        {name: "1:1 正方形",value: "1:1",ratio: "1-1"},
        {name: "4:3 图文横版封面",value: "4:3",ratio: "4-3"}, 
        {name: "3:4 图文竖版封面",value: "3:4",ratio: "3-4"}, 
        {name: "16:9 视频横版封面",value: "16:9",ratio: "16-9"},
        {name: "9:16 视频竖版封面",value: "9:16",ratio: "9-16"}
    ],
    skills:  [
        {
            id: 1,
            key: "light",
            label: "光线",
            description: "",
            skills: ["自然光","立体光","电影光","霓虹光","暖光","冷光","逆光","侧光","硬光","柔光","明暗分明","鲜艳色彩","黄昏射线","黑暗氛围","强光","赛博朋克","全局照明","戏剧感光"]
        },
        {
            id: 2,
            key: "lens",
            label: "镜头",
            description: "",
            skills: ["远景","超广角","俯视镜头","面部特写","标准镜头","电影镜头","全身照","微距镜头","背景虚化","肖像","特写"]
        },
        {
            id: 3,
            key: "composition",
            label: "构图",
            description: "",
            skills: ["引导线构图","居中构图","对称构图","不对称构图","中心构图","鸟瞰图","卫星视图"]
        }
    ]
}