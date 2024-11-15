export class Maths{

    static toRad(angle){
        return Math.PI * angle / 180;
    }

    static toDeg(angle){
        return 180 * angle / Math.PI;
    }

    //cos in degree
    static cos(angle){
        return Math.cos(this.toRad(angle))
    }

    //sin in degree
    static sin(angle){
        return Math.sin(this.toRad(angle))
    }

    static fix(angle){
        while (angle < 0) angle += 360;
        while (angle > 360) angle -=360;
        return angle;
    }

    static fix180(angle){
        angle = this.fix(angle);
        if(angle >= 180) angle -= 180;
        return angle;
    }
}