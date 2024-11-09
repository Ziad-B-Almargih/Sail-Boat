import {BoatModel} from "./BoatModel";
import {ConeModel} from "./ConeModel";
import {Constant} from "./Constant";
import {State} from "./State";
import {Controller} from "./Controller";
import {SeaModel} from "./SeaModel";
import {DrawBoat} from "./DrawBoat";
import {DrawCone} from "./DrawCone";
import {Physics} from "./Physics";
import {Projection} from "./Projection";

export class World {
    projection;
    boatModel;
    state;
    seeModel;
    drawBoat;
    drawConeList = [];
    coneModelList = [];
    phy;
    init(scene) {
        Controller.init();
        this.boatModel = BoatModel.initModel();
        this.state = State.initState();
        this.seeModel = new SeaModel();
        this.seeModel.init(scene);
        this.drawBoat = new DrawBoat();

        this.drawBoat.init(scene, this.boatModel);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 7; j++) {
                Constant.conePos.push({
                    'x': -4 - 10 * i,
                    'z': 30 - 10 * j
                });
            }
        }
        for (let index = 0; index < Constant.conePos.length; index++) {
            this.coneModelList[index] = ConeModel.initModel();
            this.drawConeList[index] = new DrawCone();
            this.drawConeList[index].init(
                scene,
                this.coneModelList[index],
                Constant.conePos[index].x,
                Constant.conePos[index].z
            );
        }
        this.phy = new Physics();
        this.projection = new Projection();
    }

    run() {
        Controller.update();
        this.seeModel.run(this.boatModel, this.state, this.coneModelList);
        this.state = this.phy.setState(this.state, this.boatModel).getNewState();
        this.boatModel = this.projection
            .setState(this.state, this.boatModel)
            .getModel();
        this.drawBoat.run(this.boatModel);

        let countX = 0;
        let countZ = 0;
        for (let index = 0; index < Constant.conePos.length; index++) {
            Constant.conePos[index].x += countX;
            Constant.conePos[index].z += countZ;
            this.drawConeList[index].run(this.coneModelList[index], Constant.conePos[index].x, Constant.conePos[index].z);
        }
    }
}
