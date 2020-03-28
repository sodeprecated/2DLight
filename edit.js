const Paths = [];

let PointIdCounter = 0;
let PathIdCounter = 0;


class Segment{
    constructor(_x1,_y1,_x2,_y2){
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
    }
}

class Point{
    constructor(_x,_y){
        this.id = PointIdCounter++;
        this.x = _x;
        this.y = _y;
    }
}

class Path{
    constructor(){
        this.id = PathIdCounter++;
        this.Points = [];
    }
    Draw(){
        //fill(255,255,255);
        strokeWeight(2);
        stroke(255,255,255);

        let frst,prev;
        for(let i in this.Points){
            if(!frst) frst = this.Points[i];
            //circle(this.Points[i].x,this.Points[i].y,12);
            if(prev){
                line(prev.x,prev.y,this.Points[i].x,this.Points[i].y);
            }
            prev = this.Points[i];
        }
        line(prev.x,prev.y,frst.x,frst.y);
    }

}


function PathToSegments(path){
    Segments = [];

    let frst,prev;
    for(let i in path.Points){
        if(!frst) frst = path.Points[i];
        if(prev){
            Segments.push(new Segment(prev.x,prev.y,path.Points[i].x,path.Points[i].y));
        }
        prev = path.Points[i];
    }
    Segments.push(new Segment(prev.x,prev.y,frst.x,frst.y));
    return Segments;
}

