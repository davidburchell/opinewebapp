function loadFonts(){
	if (sessionStorage.fontsLoaded){
		document.documentElement.classList.add('fonts-loaded');
		return;
	}

	if('fonts' in document){
		Promise.all([
			document.fonts.load('1em Sarabun'),
			document.fonts.load('300 1em Sarabun'),
			document.fonts.load('bold 1em Sarabun'),
			document.fonts.load('italic 1em Sarabun'),
			document.fonts.load('700 1em Sarabun'),
			document.fonts.load('500 1em Sarabun'),
		]).then(_ => {
			document.documentElement.classList.add('fonts-loaded');
		});
	}
}

loadFonts();