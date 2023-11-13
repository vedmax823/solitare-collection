import { LinkedinIcon } from "lucide-react"
import Link from "next/link"

const Navbar = () => {
    return(
        <header>
        <div className="w-full flex justify-around items-center">
        <p className="p-1 text:xl md:text-2xl text-white font-bold">Spider</p> 
         
            <div className="font-semibold flex items-center gap-x-2">
                <span className="text-sm md:text-xl">
                created by 
                </span>
                <Link 
                    href='https://www.linkedin.com/in/max-vedernikov-5b4572247/' 
                    rel="noopener noreferrer" target="_blank"
                    className="flex items-center gap-x-2 text-white text-bolt hover:opacity-75 text-sm md:text-xl">
                    Max Vedernikov <LinkedinIcon size={24} strokeWidth={2}/>
                </Link>
            </div>
        
        </div>
    </header>
    )
}

export default Navbar