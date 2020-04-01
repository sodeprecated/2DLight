

class Interval{
    constructor(_s,_f,_ref){
        this.begin = _s;
        this.end = _f;
        this.segment = _ref;
    }
}

function Median(l,pivot_fn = PickPivot){
    if(l.length % 2 == 1)
        return QuickSelect(l,l.length/2,pivot_fn);
    else return 0.5*(QuickSelect(l,l.length/2,pivot_fn)+QuickSelect(l,l.length/2-1,pivot_fn));
}

function QuickSelect(l,k,pivot_fn){

    k = Math.floor(k);


    if(l.length == 1){
        if(k != 0) throw new Error("k is out of range");
        return l[0];
    }

    let pivot = pivot_fn(l);

    let lows = [],highs = [],pivots = [];
    for(let i = 0; i < l.length; ++i){
        if(l[i] < pivot) lows.push(l[i]);
        else if(l[i] > pivot) highs.push(l[i]);
        else pivots.push(l[i]);
    }

    if(k < lows.length){
        return QuickSelect(lows,k,pivot_fn);
    }else if(k < lows.length + pivots.length){
        return pivots[0];
    }else{
        return QuickSelect(highs,k - lows.length - pivots.length,pivot_fn);
    }
}

function PickPivot(l){
    if(l.length == 0){
        throw new Error("Empty array");
    }

    if(l.length < 5){
        l.sort((a,b)=>{
            if(a < b) return -1;
            else if(a > b) return 1;
            else return 0;
        });
        if(l.length % 2 == 1) return l[l.length/2];
        else return 0.5*(l[l.length/2] + l[l.length/2-1]);
    }

    let chunks = Chunked(l,5);

    let full_chunks = [];
    for(let i of chunks){
        if(i.length == 5){
            i.sort((a,b)=>{
                if(a < b) return -1;
                else if(a > b) return 1;
                else return 0;
            });
            full_chunks.push(i);
        }
    }

    let medians = [];
    for(let i = 0; i < full_chunks.length; ++i){
        medians.push(full_chunks[i][2]);
    }

    let median_of_medians = Median(medians,PickPivot);

    return median_of_medians;

}

function Chunked(l,chunk_size){
    let chunks = [[]];
    let j = 0,cur = 0;
    for(let i = 0; i < l.length; ++i){
        if(cur < chunk_size){
            chunks[j].push(l[i]);
            ++cur;
        }else
        {
            cur = 1;
            ++j;
            chunks.push([]);
            chunks[j].push(l[i]);
        }
    }
    return chunks;
}




class Node{
    constructor(val, intervals,left,right){
        this.value = val;
        this.left = left;
        this.right = right;
        this.RIntervals = (intervals.sort((a,b)=>a.end - b.end)).map((a)=>a);

        this.LIntervals  = (intervals.sort((a,b)=>a.begin - b.begin)).map((a)=>a);
    }
}


function BuildTree(set){

    if(set.length == 0){
        return null;
    }
    if(set.length == 1){
        return new Node((set[0].begin+set[0].end)*0.5,set,null,null);
    }

    let median = Median(set.map((a)=>(a.begin + a.end)*0.5));
    let lft = set.filter((a)=>a.end < median), rght = set.filter((a)=>a.begin > median);
    let mid = set.filter((a)=>(a.begin<=median && a.end >= median));

    let node = new Node(median,mid,BuildTree(lft),BuildTree(rght));
    return node;
}


function GetAns(tree,_x){
    let ans;
    if(Math.abs(tree.value - _x) < 0.0001){
        return tree.LIntervals.slice(0);
    }

    if(_x < tree.value){
       ans = (tree.LIntervals.slice(0,upper_bound((tree.LIntervals).map(a=>a.begin),_x)));
      
       if(tree.left){
           ans = ans.concat(GetAns(tree.left,_x));
       }
    }else{
       
        ans = (tree.RIntervals.slice(lower_bound((tree.RIntervals).map(a=>a.end),_x)));

        if(tree.right){
            ans = ans.concat(GetAns(tree.right,_x));
        }
     }
    return ans;
}





function lower_bound(array,_x){
    let l = 0,r = array.length;
    let mid;
    while(l < r){
        mid = (l+r)>>1;
        if(_x > array[mid]){
            l = mid+1;
        }else{
            r = mid;
        }
    }
    return l;
}

function upper_bound(array,_x){
    let l = 0,r = array.length;
    let mid;
    while(l < r){
        mid = (l+r)>>1;
        if(_x < array[mid]){
            r = mid;
        }else{
            l = mid+1;
        }
    }
    return r;
}

