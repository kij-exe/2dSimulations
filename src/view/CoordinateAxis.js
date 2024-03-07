import Vector from "../utility/Vector.js";


class CoordinateAxis {
    constructor() {
    }

    redraw(view) {
        let scale = view.getScale();

        view.renderTextByTopRight(new Vector(-3,-3), "0")

        view.drawArrow(
            new Vector(-30, 0),
            new Vector(730, 0)
        );
        //   x-axis

        view.drawArrow(
            new Vector(0, -30),
            new Vector(0, 380)
        );
        // y-axis

        this.drawHorizontalTickMark(
            new Vector(0, scale),
            "1", view
        )

        this.drawVerticalTickMark(
            new Vector(scale, 0),
            "1", view
        )

        let x_tick_value = Math.floor(650 / scale);
        let y_tick_value = Math.floor(330 / scale);

        this.drawHorizontalTickMark(
            new Vector(0, y_tick_value * scale),
            y_tick_value, view
        )

        this.drawVerticalTickMark(
            new Vector(x_tick_value * scale, 0),
            x_tick_value, view
        )

        // consider what happens when 1 > 350 / this.scale
        // redisgn such that not the value is rounded but the position of the tickmark is adjusted
        }

        drawHorizontalTickMark(center, text, view) {
            this.drawTickMark(center, text, view, new Vector(7, 0));
        }

        drawVerticalTickMark(center, text, view) {
            this.drawTickMark(center, text, view, new Vector(0, 7));            
        }

        drawTickMark(center, text, view, offset) {
            view.drawLine(
                center.subtracted(offset),
                center.added(offset)
            )

            view.renderTextByTopRight(center.added(new Vector(-3, -3)), text);
        }
}

export {CoordinateAxis as default};
