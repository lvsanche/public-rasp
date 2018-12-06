function standardizeDate (date){
    if ( typeof date === 'string'){
        //means we need to break it up
        //format will be year, month, day, needs to be made clean sub a month
        var nums = date.split('-').map( str => parseInt(str));
        return new Date(nums[0], nums[1]-1, nums[2], 0, 0, 0, 0);
    }
    else {
        //means it is a date, we must strip the time just in case
        return new Date( date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0,0 );
    }
}

module.exports = {
    standardizeDate: standardizeDate
};