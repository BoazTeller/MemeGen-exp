'use strict'

function renderGallery() {
    const imgs = getImgs()
    const shuffledImgs = shuffleItems(imgs.slice())
    const strHTMLs = shuffledImgs.map(
        ({ id, url }) => 
            `<img id="${id}" onclick="onImgSelect('${id}')" src="${url}">`
    ).join('')

    const elGallery = document.querySelector('.meme-gallery')
    elGallery.innerHTML = strHTMLs
}

function onImgSelect(imgId) {    
    createMeme(imgId)  

    hideGallery()
    clearAllActiveHeaderNavs()
    showEditor()

    renderMeme()
}

function onShowGallery() {
    hideEditor()
    hideSaved()
    showGallery()
    hideSaved()
}

function hideGallery() {
    const elGallery = document.querySelector('.meme-gallery-page')
    elGallery.classList.add('hidden')
}

function showGallery() {
    const elGallery = document.querySelector('.meme-gallery-page')
    elGallery.classList.remove('hidden')
}

function hideEditor() {
    const elEditor = document.querySelector('.meme-editor-container')
    elEditor.classList.add('hidden')
}

function showEditor() {
    const elEditor = document.querySelector('.meme-editor-container')
    elEditor.classList.remove('hidden')
}

function hideSaved() {
    const elSaved = document.querySelector('.saved-memes-section')
    elSaved.classList.add('hidden')
}

function showSaved() {
    const elSaved = document.querySelector('.saved-memes-section')
    elSaved.classList.remove('hidden')
    // elSaved.classList.remove('hidden')
}

function onUpdateActiveNav(elLink) {
    if (elLink.classList.contains('active')) return

    clearAllActiveHeaderNavs()
    elLink.classList.add('active')
}

function clearAllActiveHeaderNavs() {
    const navLinks = document.querySelectorAll('.main-nav a')
    navLinks.forEach(link => link.classList.remove('active'))
}

function onDisplayRandomMeme() {
    hideGallery()
    hideSaved()

    const { id: rndImgId } = getRandomImg()
    onImgSelect(rndImgId)
}

function onSearchByKeyword(keyword) {
    updateMemeSearch(keyword)
    setFilter(keyword)
    renderKeywords()
    renderGallery()
}

function updateMemeSearch(keyword) {
    const elMemeSearch = document.querySelector('.meme-search-input')
    elMemeSearch.value = keyword
}

function onSetFilter(keyword) {
    setFilter(keyword)
    renderGallery()
}

function renderKeywords() {
    const keywords = getKeywords()
    // get the first 6 keywords
    const slicedKeywords = Object.fromEntries(
        Object.entries(keywords)
            .slice(0, 6)
    )

    let strKeywordsHTMLs = ''
    let strDatalistHTMLs = ''
    
    for (const keyword in slicedKeywords) {
        const transKeyword = getTrans(keyword)
        let keywordSize = slicedKeywords[keyword]

        strKeywordsHTMLs += `<li class="keyword" 
                                 data-trans="${keyword}"
                                 style="font-size: ${keywordSize}px" 
                                 onclick=onSearchByKeyword('${keyword}')>
                                 ${transKeyword}
                            </li>`

        strDatalistHTMLs += `<option value="${transKeyword}" 
                                     data-trans="${keyword}">
                             </option>`
    }

    const elKeywordsList = document.querySelector('.keywords-search-list')
    const elKeywordsDataList = document.getElementById('meme-keywords')
    elKeywordsList.innerHTML = strKeywordsHTMLs
    elKeywordsDataList.innerHTML = strDatalistHTMLs
}

// Refactored to be included with renderKeywords() and translate service
function initKeywordsDataList() {
    // const keywords = getKeywords()
    // const slicedKeywords = Object.entries(keywords).slice(0, 6)

    // let strHTMLs = ''
    // for (const [keyword] of slicedKeywords) {
    //     const capitalizedKeyword = capitalizeFirstLetter(keyword)
    //     strHTMLs += `<option value="${capitalizedKeyword}"></option>`
    // }

    // const keywordsDataList = document.getElementById('meme-keywords')
    // keywordsDataList.innerHTML = strHTMLs
}

function onClearSearch() {
    onSetFilter('')
    updateMemeSearch('')
    renderGallery()
}

function onSetLang(lang) {
    const currLang = getCurrLang()
    if (lang === currLang) return

    setLang(lang)
    doTrans()
    // renderKeywords()
}

///////////////////////////////////////
// Upload image from local

function onImgInput(event) {
    loadImageFromFileInput(event, addFileToImgs)
}

function loadImageFromFileInput(event, addFileToImgs) {
    const fileReader = new FileReader()
    
    fileReader.onload = function (fileLoadEvent) {
        const imageElement = new Image()
        imageElement.src = fileLoadEvent.target.result
        imageElement.onload = () => addFileToImgs(imageElement.src)
    }
    
    const selectedFile = event.target.files[0]
    fileReader.readAsDataURL(selectedFile)
}

function addFileToImgs(imgSrc) {
    addImg(imgSrc)
    renderGallery()
}

function onDisplaySaved() {
    hideGallery()
    hideEditor()
    showSaved()
    renderSavedMemes()
}









