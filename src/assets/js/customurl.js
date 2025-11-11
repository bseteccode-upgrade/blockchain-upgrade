// Avoid auto login redirect
var res = window.location.href.split('?');
var getIdFromUrl = {
    getParameterByName: function () {
        var name = 'id';
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
var id = getIdFromUrl.getParameterByName.call();
if (id && id != null && res[0].includes("/viewproduct")) {
    localStorage.setItem('fromqrscanned', id);
    window.location.href = window.location.origin + '/viewproduct/' + id;
}