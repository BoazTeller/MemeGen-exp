'use strict'

let gCurrLang = 'en'

const gTrans = {
	// Logo
    appTitle: { 
		en: 'MemeMania', 
		he: 'מימ מניה' 
	},

	/////////////////////////
	/// * Main header * ///
	galleryLink: { 
		en: 'Gallery', 
		he: 'גלריה' 
	},
	savedLink: { 
		en: 'Saved', 
		he: 'שמורים' 
	},
	randomizeLink: { 
		en: 'Randomize', 
		he: 'אקראי' 
	},
	
	/////////////////////////
	/// * Gallery page * ///
	// Search Uplaod section
	searchInput: { 
		en: 'Search', 
		he: 'חפש' 
	},
	uploadBtn: { 
		en: 'Upload', 
		he: 'העלה' 
	},
	
	// Keywords (search filter tags)
	funny: { 
		en: 'Funny', 
		he: 'העלה' 
	},
    politics: { 
		en: 'Politics', 
		he: 'פוליטיקה' 
	},
	animal: { 
		en: 'Animal', 
		he: 'חיה' 
	},
	baby: { 
		en: 'Baby', 
		he: 'תינוק' 
	},
	cute: { 
		en: 'Cute', 
		he: 'חמוד' 
	},
	smile: { 
		en: 'Smile', 
		he: 'חייך' 
	},
	dog: { 
		en: 'Dog', 
		he: 'כלב' 
	},
	cat: { 
		en: 'Dog', 
		he: 'חתול' 
	},
	
	/////////////////////////
	/// * Editor page * ///
	textInput: {
		en: 'Enter text', 
		he: 'הזן טקסט' 
	},
	
	/// * Saved memes page * ///
	savedSubTitle: {
		en: 'No saved memes found', 
		he: 'אין ממים שמורים'
	},

    /////////////////////////
	/// * Main footer * ///
    footerTxt: {
		en: 'All your meme are belong to us.', 
		he: 'כל הממים שלך הם שייכים אותנו.' 
	}
}

function setLang(lang) {
    gCurrLang = lang
}

function getCurrLang() {
    return gCurrLang
}

function getTrans(key, lang = gCurrLang) {
    return  gTrans[key]?.[lang] || null
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    
    els.forEach(el => {
        const transKey = el.dataset.trans
        const translation = getTrans(transKey)

        if (el.classList.contains('logo')) {
            // To not over-write the span inside the div
            el.childNodes[0].nodeValue = translation
            return
        }

        if (el.nodeName === 'INPUT') {
            el.placeholder = translation
            return
        }
        
        el.innerText = translation
        // el.contentText = translation
    })
     
    // This will need to be refactored if more languages are added
    document.body.classList.toggle('rtl')
}