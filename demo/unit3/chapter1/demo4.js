function View() {

}

View.prototype.test = function () {
    console.log('test');
}

View.test1 = function () {
    console.log('test1');
};
module.exports = View;