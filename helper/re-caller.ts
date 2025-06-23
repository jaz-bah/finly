import { useQueryClient } from "@tanstack/react-query";

export const reCaller = (type: string, date: Date) => {
    const queryClient = useQueryClient();

    const queryKey = [];

    if(type === "all") queryKey.push("transactions");



    queryClient.invalidateQueries({ queryKey: ['transactions'] });
}