interface ProgressBarProps{
    progress:number
}

export function ProgressBar(props: ProgressBarProps){
    const progressStyles =`${props.progress}%`
    return (
        <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
            <div 
                role="progressbar"
                aria-label="Progresso de hábitos completados ness dia"
                aria-aria-valuenow={props.progress}
                className="h-3 rounded-xl bg-violet-600 transition-all"
                style={{width:progressStyles}}
            />
        </div>
    )
}