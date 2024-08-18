function typewriteVerse() {

    var str = 'Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.';

    var spans = '<span>' + str.split('').join('</span><span>') + '</span>';
    $(spans).hide().appendTo('#graphicVerse').each(function (i) {
        $(this).delay(80 * i).css({
            display: 'inline',
            opacity: 0
        }).animate({
            opacity: 1
        }, 80);
    });
}

window.addEventListener("load", typewriteVerse);