export default String.prototype.capitalize = function() {

    return (this.charAt(0).toUpperCase() + this.substr(1)).replace('-', ' ');
}