import { useEffect, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { api } from '../lib/axios';
import dayjs from 'dayjs';

interface HabitsListProps{
    date: Date;
    onCompletedChanged: (completed: number) => void
}

interface Habitsinfo{
    possibleHabits: Array<{
        id: string;
        title:string;
        created_at: string;
    }>,
    completedHabits: string[]
}

export function HabitList({date, onCompletedChanged}: HabitsListProps){
    const [habitsInfo, setHabitsInfo] = useState<Habitsinfo>();

    useEffect(() => {
        api.get('day',{
            params: {
                date:date.toISOString()
            }}).then(response => {
                setHabitsInfo(response.data);                
            })
    },[]);

    function handleToggleHabit(habitId: string){
        api.patch(`/habits/${habitId}/toggle`)

        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

        let completedHabits: string[] = [];

        if(isHabitAlreadyCompleted){
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
            
        }else{
            completedHabits = [...habitsInfo!.completedHabits,habitId]
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        })

        onCompletedChanged(completedHabits.length)
    }

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    return(
            <div className='mt-6 flex flex-col gap-3'>
                {habitsInfo?.possibleHabits.map(habit => {
                    return(
                        <Checkbox.Root 
                        key={habit.id}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        checked={habitsInfo.completedHabits.includes(habit.id)}
                        className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                        disabled={isDateInPast}
                        >
                            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'>
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white" />
                                </Checkbox.Indicator>                             
                            </div>

                            <samp className='font-semibold text-xl text-white lending-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                {habit.title}
                            </samp>
                        </Checkbox.Root>
                    )
                })}
                
            </div>   
    )
}