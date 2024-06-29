// rapid table sort
// rapid_table_sort
function rapid_table_sort(tbID) {

    if (!tbID) {
        tbID = "table:eq(0)";
    } else {
        tbID = '#' + tbID.replace(/^\#/, '')
    }
    $(tbID).find("> caption").on("click", function (evt) {
        var ibase = 0
        if (evt.shiftKey) ibase = 1
        $(tbID).find("tbody tr").each(function (i) {
            $(this).find("td:eq(0)").text(ibase + i).attr("txt_idx", ibase + i)
        })
    })


    $(tbID).find(" > thead > tr > th").each(function () {
        $(this).on("click", function (evt) {
            evt.preventDefault()
            evt.stopPropagation()
            var header_colidx = $(this).index()

            rapid_sort_table_col(tbID, header_colidx, -1)
            return
        })
    })
}
function rapid_sort_table_col(tbID, header_colidx, sortDirection) {
    if (!tbID) tbID = "table:eq(0)";
    if (undefined === header_colidx) {
        return
    }
    if ([1, -1].indexOf(sortDirection) < 0) sortDirection = 1
    ////////////
    var eThCol = $(`${tbID} > thead > tr > th:eq(${header_colidx})`)
    if(!eThCol) return;
    
    ////: determine swap ascend or descend flag.
    var asend = $(eThCol).attr("asend")
    if (undefined === asend) {
        $(eThCol).attr("asend", -1) //initial 

        //remember original order.
        $(tbID).find("> tbody > tr").each(function (i) {
            $(this).attr("origIdx", i)
        })
    }
    asend = parseInt($(eThCol).attr("asend"))
    $(eThCol).attr("asend", -asend)
   
    /////////////////////////////////////////

    var etrary = $(tbID).find("> tbody > tr");
    ////: determine sort by number or string types

    ////:pre-check data type property.
    var bHasEmpty = false, bHasNaN = false, fmin = -999999999, tmpAry = []
    etrary.each(function (i) {
        var tx = $(this).find(`> td:eq(${header_colidx})`).text().trim()
        if (tx.length === 0) {
            bHasEmpty = true
        } else {
            var ft = parseFloat(tx)
            if (isNaN(ft)) {
                bHasNaN = true
            } else {
                if (ft < fmin) fmin = ft
            }
        }
        tmpAry.push([tx, ft, this])
    })

    ////:determine the data type for comparison.
    var cmpIdx = 0
    if (bHasNaN === true) {//treat as string
        cmpIdx = 0 //regardless bHasEmpty. use txt data
    }
    else { //treat as numerals
        cmpIdx = 1 //use numeral data for comparison
        if (bHasEmpty === true) {//replace empty with fmin
            tmpAry = []
            etrary.each(function (i) {
                var tx = $(this).find(`> td:eq(${header_colidx})`).text().trim()
                var ft = parseFloat(tx)
                if (tx.length === 0) {
                    ft = fmin
                }
                tmpAry.push([tx, ft, this])
            })
        }
    }

    ///////: sort by compare using correct data type by cmpIdx
    if (cmpIdx >= 0) {
        tmpAry.sort(function (ar1, ar2) {
            if (ar1[cmpIdx] === ar2[cmpIdx]) return 0
            if (ar1[cmpIdx] > ar2[cmpIdx]) {
                return asend
            } else {
                return -asend;
            }
        })


        /////: update table
        var tbod = $(tbID).find("> tbody:eq(0)")
        for (var i = 0; i < tmpAry.length; i++) {
            tbod.prepend(tmpAry[i][2])
        }
        $(tbID).find("> tbody:eq(1)").remove()  //remove the prev tbody.
    }
};

////////////////////////////////////////////////////////

function table_col_index(tid, iCol) {
    if (!tid) tid = "table";
    if (undefined === iCol) iCol = 0
    $(tid).each(function () {
        $(this).find("> tbody > tr").each(function (i, v) {
            $(this).find(`td:eq(${iCol})`).text(i);
        });
    });
};
function table_col_hidden(tid, iCol) {
    if (!tid) tid = "table";
    if (undefined === iCol) iCol = 0
    $(tid).each(function () {
        $(this).find("> tbody > tr").each(function (i, v) {
            $(this).find(`td:eq(${iCol})`).attr("hidden", "true")
        });
    });
};

function table_rows_inclusive_remove(tid, istart, iend) {
    if (!tid) tid = "table";
    if (undefined === iend) iend = 999999999
    $(tid).each(function () {
        $(this).find("> tbody > tr").each(function (i, v) {
            if (i >= istart && i <= iend) {
                $(this).attr("hidden", "true").remove()
            }
        });
    });
};

function thousand_seperator(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}















