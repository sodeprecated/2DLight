
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


function Dist(ray,segment){
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


function Closest(ray){
    let intersections = (GetAns(IntervalTree,ray.angle).concat(GetAns(IntervalTree,2*Math.PI + ray.angle))).map(a=>a.reference);
    if(intersections.length == 0){
        return Infinity;
    }
    let mndist = Dist(ray,intersections[0]);
    for(let i = 1; i < intersections.length; ++i){
        let d = Dist(ray,intersections[i]);
        if(d != Infinity)
            mndist = Math.min(mndist,d);
    }
    return mndist;
}


function Rad(dx,dy){
    let cs = dx/(Math.sqrt(dx*dx+dy*dy));
    let angle = acos(cs);
    if(dy < 0.){
        angle = 2*Math.PI - angle;
    }
    return angle;
}

function SegmentToInterval(lightPoint,segment){
    let first,second;
    let dx = segment.x1 - lightPoint.x;
    let dy = lightPoint.y - segment.y1;
    first = Rad(dx,dy);
    
    dx = segment.x2 - lightPoint.x;
    dy = lightPoint.y - segment.y2;
    second = Rad(dx,dy);
    
    if(second > first){
        if(second - first >= Math.PI){
            first += 2.*Math.PI;
        }
    }else{
        if(first - second >= Math.PI){
            second += 2.*Math.PI;
        }
    }
    return new Interval(Math.min(first,second),Math.max(first,second),segment);
}



function GetLightPath(point,Paths){

    let RayPoints = [];
    let Intervals = [];

    (Paths.forEach(a=>(PathToSegments(a).forEach(b=>{
        let interval = SegmentToInterval(point,b);
        RayPoints.push(interval.begin,interval.begin + 0.0001,interval.begin - 0.0001,interval.end,interval.end + 0.0001,interval.end - 0.0001);
        Intervals.push(interval);
    }))))

    IntervalTree = BuildTree(Intervals);

    RayPoints = RayPoints.map(a=>{
        if(a >= 2*Math.PI){
            a -= 2*Math.PI;
        }
        return a;
    }).sort((a,b)=>a - b);

    let LightPath = [];

    for(let i of RayPoints){
        let dx = Math.cos(i),dy = Math.sin(i);
        let d = Closest(new Ray(point,i,dx,dy));
        
        if(d == Infinity) continue;  

        LightPath.push({x:point.x + dx*d,y:point.y - dy*d});
    }
    return LightPath;
}


