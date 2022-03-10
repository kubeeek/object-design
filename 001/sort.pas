program Sort;

var i: integer;
var j: integer;
var temp: integer;
var MAX_RANGE: integer = 100;
var random_array : array of integer;

procedure FillArrayWithRandomness(var arr : array of integer; var max : integer);
begin

        for i := 0 to Length(random_array) do
        begin
                arr[i] := Random(max);
        end;
end;

procedure BubbleSort(var arr : array of integer);
begin
        for j := 1 to Length(arr) do
        begin
                for i := 0 to Length(arr)-1 do
                begin
                        if (random_array[i] > random_array[i+1]) then
                        begin
                                temp := random_array[i];
                                random_array[i] := random_array[i+1];
                                random_array[i+1] := temp;
                        end;
                end;
        end;
end;

begin
        SetLength(random_array, 50);
        FillArrayWithRandomness(random_array, MAX_RANGE);

        writeLn('Before: ');
        for i := 0 to Length(random_array) do
        begin
                write(random_array[i]);
                write(' ');
        end;
        writeLn('');


        BubbleSort(random_array);

        writeLn('After: ');
        for i := 0 to Length(random_array) do
        begin
                write(random_array[i]);
                write(' ');
        end;
        writeLn('');
end.