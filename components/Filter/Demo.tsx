// Demo.tsx
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button, Chip, Input } from '@nextui-org/react';
import { FaFilter } from "react-icons/fa6";
import { useChipsStore } from "@/store/useChipsStore";
interface DemoProps {
 
  chips: string[];
}

const Demo: React.FC<DemoProps> = () => {
  const [inputText, setInputText] = useState<string>('');
  const addChip = useChipsStore((state) => state.addChip);
  const [showInput, setShowInput] = useState<boolean>(false);

   const handleGoClick = () => {
    if (inputText.trim() !== '') {
      addChip(inputText);
      setInputText('');
    }
  };
  return (
    <>
      <Popover>
        <PopoverTrigger className="text-xl text-white"><FaFilter color="black "  size={30}/></PopoverTrigger>
        <PopoverContent>
          <div>
            <Input
              label="Type something..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button onClick={handleGoClick}>Go</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* <div style={{ marginTop: '10px' }}>
        {chips.map((chip, index) => (
          <Chip key={index}>{chip}</Chip>
        ))}
      </div> */}
    </>
  );
};

export default Demo;
