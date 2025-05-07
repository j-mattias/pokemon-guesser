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
    let color = "";
    switch (progressRounded) {
        case 1:
            // Red
            color = "#ee2424";
            break;
        case 15:
            // Orange
            color = "#ee8624";
            break;
        case 40:
            // Yellow
            color = "#eed024";
            break;
        case 65:
            // Light green
            color = "#b1ee24";
            break;
        case 85:
            // Green
            color = "#4cee24";
            break;
        default:
            break;
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
