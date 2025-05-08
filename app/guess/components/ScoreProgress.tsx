import "./ScoreProgress.css";

interface IScoreProgress {
    score: number;
    genTotal: number;
    generationName?: string;
}

export default function ScoreProgress({ score, genTotal, generationName }: IScoreProgress) {
    // Calculate the percentage width of the bar based on score
    // and total pokemon in the generation
    const progressWidth = (score / genTotal) * 100;

    const progressRounded = Math.round(progressWidth);

    // Set the color based on rounded percent
    let color = ""
    if (progressRounded < 15) {
        // Red
        color = "#ee2424";
    } else if (progressRounded < 40) {
        // Orange
        color = "#ee8624";
    } else if (progressRounded < 65) {
        // Yellow
        color = "#eed024";
    } else if (progressRounded < 90) {
        // Light green
        color = "#b1ee24";
    } else {
        // Green
        color = "#4cee24";
    }

    const barStyle = {
        width: `${progressWidth}%`,
        backgroundColor: `${color}`,
    };

    return (
        <div className="score-progress">
            {generationName && <h3 className="score-progess__generation">{generationName}</h3>}
            <div className="score-progress__bar-container">
                <div className="score-progress__bar" style={barStyle}></div>
            </div>
            <h3 className="score-progress__count">
                {score} / {genTotal}
            </h3>
        </div>
    );
}
