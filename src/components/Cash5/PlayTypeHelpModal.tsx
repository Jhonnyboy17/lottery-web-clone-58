
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PlayTypeHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayTypeHelpModal: React.FC<PlayTypeHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-md font-bold">TYPE OF PLAY</DialogTitle>
            <button 
              onClick={onClose} 
              className="rounded-full w-6 h-6 hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <div className="relative w-4 h-4">
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 -translate-y-1/2 rotate-45"></span>
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 -translate-y-1/2 -rotate-45"></span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold">Straight</h3>
              <p className="text-gray-600 text-sm">Acerte todos os números na ordem exata.</p>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold">Box</h3>
              <p className="text-gray-600 text-sm">Acerte todos os números em qualquer ordem.</p>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold">Combo</h3>
              <p className="text-gray-600 text-sm">Jogue todas as combinações diretas de todos os números e acerte em qualquer ordem.</p>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold">Straight/Box</h3>
              <p className="text-gray-600 text-sm">Acerte todos os números na ordem exata ou em qualquer ordem.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayTypeHelpModal;
