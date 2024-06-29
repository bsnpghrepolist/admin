// rapid table sort
// rapid_table_sort
function rapid_table_sort(tbid) {

    if (!tbid) {
        tbid = "table";
    } else {
        tbid = '#' + tbid.replace(/^\#/, '')
    }
    $(tbid).find("caption").on("click", function (evt) {
        var ibase = 0
        if (evt.shiftKey) ibase = 1
        $(tbid).find("tbody tr").each(function (i) {
            $(this).find("td:eq(0)").text(ibase + i).attr("txt_idx", ibase + i)
        })
    })


    $(tbid).find("thead tr").find("th").each(function () {
        $(this).on("click", function (evt) {
            evt.preventDefault()
            evt.stopPropagation()
            var header_colidx = $(this).index()

            ////: determine swap ascend or descend flag.
            var asend = $(this).attr("asend")
            if (undefined === asend) {
                $(this).attr("asend", -1) //initial 

                //remember original order.
                $(tbid).find("tbody tr").each(function (i) {
                    $(this).attr("origIdx", i)
                })
            }
            asend = parseInt($(this).attr("asend"))
            $(this).attr("asend", -asend)

            ////////ctrKey override auto flip.
            if (evt.shiftKey) {
                asend = 1
            }
            if (evt.altKey) {
                asend = -1
            }
            /////////////////////////////////////////

            var etrary = $(tbid).find("tbody tr");
            ////: determine sort by number or string types

            ////:precheck data type property.
            var bHasEmpty = false, bHasNaN = false, fmin = -999999999, tmpAry = []
            etrary.each(function (i) {
                var tx = $(this).find(`td:eq(${header_colidx})`).text().trim()
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
                cmpIdx = 1 //use numeral data
                if (bHasEmpty === true) {//replace empty with fmin
                    tmpAry = []
                    etrary.each(function (i) {
                        var tx = $(this).find(`td:eq(${header_colidx})`).text().trim()
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
                var tbod = $(tbid).find("tbody")
                for (var i = 0; i < tmpAry.length; i++) {
                    tbod.prepend(tmpAry[i][2])
                }
            }

        })
    })
}
////////////////////////////////////////////////////////

function table_col_index(tid, iCol) {
    if (!tid) tid = "table";
    if (undefined === iCol) iCol = 0
    $(tid).each(function () {
        $(this).find("tbody tr").each(function (i, v) {
            $(this).find(`td:eq(${iCol})`).text(i);
        });
    });
};
function table_col_hidden(tid, iCol) {
    if (!tid) tid = "table";
    if (undefined === iCol) iCol = 0
    $(tid).each(function () {
        $(this).find("tbody tr").each(function (i, v) {
            $(this).find(`td:eq(${iCol})`).attr("hidden", "true")
        });
    });
};

function table_rows_inclusive_remove(tid, istart, iend) {
    if (!tid) tid = "table";
    if (undefined === iend) iend = 999999999
    $(tid).each(function () {
        $(this).find("tbody tr").each(function (i, v) {
            if (i >= istart && i <= iend) {
                $(this).attr("hidden", "true").remove()
            }
        });
    });
};

function thousand_seperator(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}















//////
// no use.
function table_tbody_sort___work_but_lost_property(tbid, cbf) {
    if (!tbid) {
        tbid = "table";
    }

    $(tbid).find("thead tr").find("td").each(function () {
        $(this).on("click", function () {
            var header_colidx = $(this).index()

            //// swap ascend or descend flag.
            var asend = $(this).attr("asend")
            if (undefined === asend) $(this).attr("asend", -1)
            asend = parseInt($(this).attr("asend"))
            $(this).attr("asend", -asend)

            ///////////////////////////////////////
            var etrary = $(tbid).find("tbody tr");

            etrary.sort(function (etr1, etr2) {
                var tx1 = $(etr1).find(`td:eq(${header_colidx})`).text()
                var tx2 = $(etr2).find(`td:eq(${header_colidx})`).text()
                if (!isNaN(tx1) && !isNaN(tx2)) {
                    tx1 = parseFloat(tx1)
                    tx2 = parseFloat(tx2)
                }

                if (tx1 > tx2) {
                    return asend
                } else {
                    return -asend;
                }
            })

            $(tbid).find("tbody").empty()   //remove old 
            etrary.each(function () {       //add sorted 
                $(tbid).find("tbody").prepend(this)
            })
            if (cbf) cbf()
        })
    })
}
function swapNodes(n1, n2) {

    var p1 = n1.parentNode;
    var p2 = n2.parentNode;
    var i1, i2;

    if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }

    if (p1.isEqualNode(p2) && i1 < i2) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}


/// this method is too slow.
function sortTable(table, iCol, bAsend) {
    var rows, switching, i, x, y, shouldSwitch;
    //table = document.getElementById("myTable");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers):  i=0 if tbody*/
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[iCol];
            y = rows[i + 1].getElementsByTagName("TD")[iCol];
            // Check if the two rows should switch place:
            var bCompare = x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()
            if (bCompare) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}