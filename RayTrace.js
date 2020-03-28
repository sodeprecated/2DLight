
let IntervalTree;

class Ray{
    constructor(point,angle){
        this.x = point.x;
        this.y = point.y;
        this.angle = angle;
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
    RayPoint = {x:ray.x+Math.cos(ray.angle),y: ray.y-Math.sin(ray.angle)};
    let SL = new Line(segment.y2 - segment.y1,segment.x1 - segment.x2, segment.y1*segment.x2 - segment.y2*segment.x1);
    let RL = new Line(RayPoint.y - ray.y, ray.x - RayPoint.x, ray.y * RayPoint.x - RayPoint.y * ray.x);

    if(Math.abs(SL.A * RL.B - RL.A*SL.B) <= 0.000001) return Infinity;

    let IntersectPoint = {x:(SL.B * RL.C - RL.B * SL.C) / (SL.A * RL.B - RL.A * SL.B), y:(RL.A * SL.C - SL.A * RL.C) / (SL.A * RL.B - RL.A * SL.B)};



    if(IntersectPoint.x < Math.min(segment.x1,segment.x2)-0.001 || IntersectPoint.x > Math.max(segment.x1,segment.x2)+0.001) return Infinity;
    if(IntersectPoint.y < Math.min(segment.y1,segment.y2)-0.001 || IntersectPoint.y > Math.max(segment.y1,segment.y2)+0.001) return Infinity;


    let cs1 = (IntersectPoint.x - ray.x)/Math.sqrt((IntersectPoint.x - ray.x)*(IntersectPoint.x - ray.x) + (IntersectPoint.y - ray.y)*(IntersectPoint.y - ray.y));
    let cs2 = (RayPoint.x - ray.x)/Math.sqrt((RayPoint.x - ray.x)*(RayPoint.x - ray.x) + (RayPoint.y - ray.y)*(RayPoint.y - ray.y));


    let sn1 = (IntersectPoint.y - ray.y)/Math.sqrt((IntersectPoint.x - ray.x)*(IntersectPoint.x - ray.x) + (IntersectPoint.y - ray.y)*(IntersectPoint.y - ray.y));
    let sn2 = (RayPoint.y - ray.y)/Math.sqrt((RayPoint.x - ray.x)*(RayPoint.x - ray.x) + (RayPoint.y - ray.y)*(RayPoint.y - ray.y));


    if(Math.abs(cs2 - cs1) > 0.0001 || Math.abs(sn2 - sn1) > 0.0001){
        return Infinity;
    }

    let Sqdist = (IntersectPoint.x - ray.x)*(IntersectPoint.x - ray.x) + (IntersectPoint.y - ray.y)*(IntersectPoint.y - ray.y);

    return Sqdist;

}


function getMinDist(ray){
    let intersections = (GetAns(IntervalTree,ray.angle).concat(GetAns(IntervalTree,2*Math.PI + ray.angle))).map(a=>a.segment);
    if(intersections.length == 0){
        return Infinity;
    }
    let mndist = 10000000;// getDist(ray,intersections[0]);
    for(let i = 0; i < intersections.length; ++i){
        //if(!check(intersections[i],ray,i)) continue;
        let d = getDist(ray,intersections[i]);
        if(d != Infinity)
            mndist = Math.min(mndist,d);
    }
    return Math.sqrt(mndist);
}

function toRadCoord(dx,dy){
    let sn = dy/(Math.sqrt(dx*dx+dy*dy));

    let angle = Math.asin(sn);
    if(dx < 0.){
        angle = Math.PI - angle;
    }else{
        if(angle < 0.){
            angle = 2.*Math.PI + angle;
        }
    }
    return angle;

    // //if(sn < 0) sn*=-1;
    // if(dx < 0){
    //     if(dy < 0){
    //         return 2. - sn;
    //     }else{
    //         return 2. - sn;
    //     }
    // }else{
    //     if(dy < 0){
    //         return 4. + sn;
    //     }else{
    //         return sn;
    //     }
    // }
}



function getLightPath(point,Paths,Box){



    BoxSegs = [];
    BoxSegs.push(new Segment(0,0,Box.Width,0));
    BoxSegs.push(new Segment(Box.Width,0,Box.Width,Box.Height));
    BoxSegs.push(new Segment(Box.Width,Box.Height,0,Box.Height));
    BoxSegs.push(new Segment(0,Box.Height,0,0));




    let fs,sc,dx,dy,sn;
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

        RayPoints.push(fs,fs+0.03,fs-0.03,sc,sc+0.03,sc-0.03);

        return new Interval(Math.min(fs,sc),Math.max(fs,sc),b);
    })))

 


    let Intervals = [];
    for(let i of set){
        for(let j of i)
            Intervals.push(j);
    }


    for(let i of BoxSegs){
        fs = 0.;
        dx = i.x1 - point.x;
        dy = point.y - i.y1;
        fs = toRadCoord(dx,dy);
        
        sc = 0.;
        dx = i.x2 - point.x;
        dy = point.y - i.y2;
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


        RayPoints.push(fs,sc);
        Intervals.push(new Interval(Math.min(fs,sc),Math.max(fs,sc),i));
    }


    IntervalTree = BuildTree(Intervals);


    RayPoints = RayPoints.map(a=>{
        if(a >= 2*Math.PI){
            a -= 2*Math.PI;
        }
        return a;
    }).sort((a,b)=>a - b);

    let ret = [];

    for(let i of RayPoints){
        //let angl = toAngle(i);
        let dx = Math.cos(i),dy = Math.sin(i);

        let d = getMinDist(new Ray(point,i));



        if(d == Infinity) continue;  

        let X = point.x + dx*d,Y = point.y - dy*d;


        ret.push({x:X,y:Y});

    }



    return ret;



}


