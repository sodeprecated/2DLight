
let IntervalTree;

class Ray{
    constructor(point,angle,_dx,_dy){
        this.x = point.x;
        this.y = point.y;
        this.angle = angle;
        this.dx = _dx;
        this.dy = _dy;
    }
}


class Line{
    constructor(a,b,c){
        this.A = a;
        this.B = b;
        this.C = c;
    }
}


function getDist(ray,segment){


    let r_px = ray.x,r_py = ray.y,s_px = segment.x1,s_py = segment.y1,r_dx = ray.dx,r_dy = -ray.dy,s_dx = segment.x2 - segment.x1,s_dy = segment.y2 - segment.y1;

    if((r_dx == s_dx && r_dy == s_dy)||(r_dx == -s_dx && r_dy == -s_dy)){
        return Infinity;
    }


    let T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);

    let T1 = (s_px+s_dx*T2-r_px)/r_dx;

    if(Math.abs(r_dx) <= 0.00001){
        T1 = (s_py+s_dy*T2-r_py)/r_dy;
    }


    if(T1 >= 0 && T2 >= -0.00000000001 && T2 <= 1.000000000001){
        return T1;
    }else return Infinity;

}


function getMinDist(ray){
    let intersections = (GetAns(IntervalTree,ray.angle).concat(GetAns(IntervalTree,2*Math.PI + ray.angle))).map(a=>a.segment);
    if(intersections.length == 0){
        return Infinity;
    }
    let mndist = getDist(ray,intersections[0]);
    for(let i = 1; i < intersections.length; ++i){
        let d = getDist(ray,intersections[i]);
        if(d != Infinity)
            mndist = Math.min(mndist,d);
    }
    return mndist;//Math.sqrt(mndist);
}




function toRadCoord(dx,dy){
    let cs = dx/(Math.sqrt(dx*dx+dy*dy));

    let angle = acos(cs);
    if(dy < 0.){
        angle = 2*Math.PI - angle;
    }
    return angle;
}



function getLightPath(point,Paths){

//let segs = [];

    let fs,sc,dx,dy;
    let RayPoints = [];
    let set = Paths.map(a=>(PathToSegments(a).map(b=>{
        fs = 0.;
        dx = b.x1 - point.x;
        dy = point.y - b.y1;
        fs = toRadCoord(dx,dy);
        
        sc = 0.;
        dx = b.x2 - point.x;
        dy = point.y - b.y2;
        sc = toRadCoord(dx,dy);
        
        if(sc > fs){
            if(sc - fs >= Math.PI){
                fs += 2.*Math.PI;
            }
        }else{
            if(fs - sc >= Math.PI){
                sc += 2.*Math.PI;
            }
        }


        //segs.push(b);

        RayPoints.push(fs,fs+0.03,fs-0.03,sc,sc+0.03,sc-0.03);

        return new Interval(Math.min(fs,sc),Math.max(fs,sc),b);
    })))

    let Intervals = [];
    for(let i of set){
        for(let j of i)
            Intervals.push(j);
    }

    IntervalTree = BuildTree(Intervals);


    RayPoints = RayPoints.map(a=>{
        if(a >= 2*Math.PI){
            a -= 2*Math.PI;
        }
        return a;
    }).sort((a,b)=>a - b);

    let LightPath = [];

    for(let i of RayPoints){
        //let angl = toAngle(i);
        let dx = Math.cos(i),dy = Math.sin(i);

        let d = getMinDist(new Ray(point,i,dx,dy));
        



        if(d == Infinity) continue;  

        let X = point.x + dx*d,Y = point.y - dy*d;


        LightPath.push({x:X,y:Y});

    }



    return LightPath;
}


